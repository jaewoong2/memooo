import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calendar_v3, google } from 'googleapis';
import { User } from 'src/users/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthService } from 'src/auth/auth.service';
import { Client as NotionClient } from '@notionhq/client';
import {
  AddPageDto,
  CreateNotionPageResponseDto,
  NotionDatabaseDto,
} from './dto/notion-create-page.dto';
import { plainToInstance } from 'class-transformer';
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import dayjs from 'dayjs';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(User)
    private readonly authService: AuthService,
  ) {}

  async listDatabases(accessToken: string): Promise<any> {
    try {
      const notion = new NotionClient({ auth: accessToken });
      // Use Notion search API to list databases
      const response = await notion.search({
        filter: {
          property: 'object',
          value: 'database',
        },
      });

      const results = plainToInstance(NotionDatabaseDto, response.results);

      return results;
    } catch (err) {
      throw new InternalServerErrorException(
        `Error listing Notion databases: ${err.message}`,
      );
    }
  }

  async createEvent({
    userId,
    accessToken,
    description,
    endTime,
    startTime,
    summary,
  }: CreateEventDto): Promise<calendar_v3.Schema$Event> {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      // Google Calendar API 클라이언트 생성
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // 이벤트 데이터 준비
      const event: calendar_v3.Schema$Event = {
        summary,
        description,
        start: {
          dateTime: startTime,
          timeZone: 'Asia/Seoul',
        },
        end: {
          dateTime: endTime,
          timeZone: 'Asia/Seoul',
        },
      };

      try {
        // 이벤트 삽입 시도
        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });

        return response.data;
      } catch (error) {
        console.error(error.response.data.error_description);
        // 401 에러 처리
        if (error.response?.status === 401) {
          console.error(
            'Access token is invalid or expired. Refreshing token...',
          );

          const user = await this.authService.refreshAccessToken({
            id: userId,
          });

          oauth2Client.setCredentials({
            access_token: user.access_token,
          });

          // 다시 삽입 시도
          const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
          });

          return response.data;
        } else {
          throw error; // 401 외의 에러는 그대로 throw
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getNotionClient(token?: string) {
    return new NotionClient({ auth: token });
  }

  async getDatabaseSchema(notion: NotionClient, databaseId: string) {
    try {
      const database = await notion.databases.retrieve({
        database_id: databaseId,
      });
      return database.properties;
    } catch (err) {
      throw new InternalServerErrorException(
        `Error retrieving database schema: ${err.message}`,
      );
    }
  }

  identifyMissingProperties(
    existingProperties: Record<string, any>,
    checkboxes: { name: string; checked: boolean }[],
  ): Record<string, any> {
    const missingProperties: Record<string, any> = {};
    if (checkboxes && checkboxes.length > 0) {
      checkboxes.forEach(({ name }) => {
        if (!existingProperties[name]) {
          missingProperties[name] = { type: 'checkbox', checkbox: {} };
        }
      });
    }
    return missingProperties;
  }

  async updateDatabaseSchema(
    notion: NotionClient,
    databaseId: string,
    missingProperties: Record<string, any>,
  ): Promise<void> {
    if (Object.keys(missingProperties).length > 0) {
      try {
        await notion.databases.update({
          database_id: databaseId,
          properties: missingProperties,
        });
      } catch (err) {
        throw new InternalServerErrorException(
          `Error updating database schema: ${err.message}`,
        );
      }
    }
  }

  preparePageProperties(
    title: { key?: string; value?: string },
    checkboxes: { name: string; checked: boolean }[],
    createdTime?: string,
  ): Record<string, any> {
    const properties: CreatePageParameters['properties'] = {
      [title.key ?? 'Name']: {
        title: [
          {
            type: 'mention',
            mention: {
              date: { start: title.value },
            },
          },
        ],
      },
    };

    if (checkboxes && checkboxes.length > 0) {
      checkboxes.forEach(({ name, checked }) => {
        properties[name] = { checkbox: checked };
      });
    }

    if (createdTime) {
      properties['Created time'] = {
        date: { start: createdTime },
      };
    }

    return properties;
  }

  prepareContentBlocks(
    checkboxes: { name: string; checked: boolean }[],
  ): any[] {
    if (checkboxes && checkboxes.length > 0) {
      return checkboxes.map(({ name, checked }) => ({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [
            {
              type: 'text',
              text: { content: name },
            },
          ],
          checked,
        },
      }));
    }

    // Default content if no checkboxes provided
    return [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a default paragraph for your Notion page.',
              },
            },
          ],
        },
      },
    ];
  }

  async createNotionPage(
    notion: NotionClient,
    databaseId: string,
    properties: CreatePageParameters['properties'],
    children: any[],
  ) {
    try {
      return await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
        children,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Error creating Notion page: ${err.message}`,
      );
    }
  }

  async addPageWithCheckboxes(dto: AddPageDto) {
    const { accessToken, databaseId, checkboxes, date, pageTitle: title } = dto;
    const notion = new NotionClient({ auth: accessToken });

    const pageTitle = dayjs(title ?? new Date()).format('YYYY-MM-DD');

    const existingProperties = await this.getDatabaseSchema(notion, databaseId);

    const missingProperties = this.identifyMissingProperties(
      existingProperties,
      checkboxes || [],
    );

    try {
      await this.updateDatabaseSchema(notion, databaseId, missingProperties);

      const titleObject = Object.entries(existingProperties)
        .map(([key, value]) => {
          if (value.type === 'title') return { key: key, value: pageTitle };
          return null;
        })
        .filter((value) => !!value)[0];

      // Step 5: Prepare page properties
      const properties = this.preparePageProperties(
        titleObject,
        checkboxes || [],
        date,
      );

      // Step 6: Prepare content blocks
      const children = this.prepareContentBlocks(checkboxes || []);

      // Step 7: Create the page
      const response = await this.createNotionPage(
        notion,
        databaseId,
        properties,
        children,
      );

      const result = plainToInstance(CreateNotionPageResponseDto, response);

      return result;
    } catch (err) {
      if (Object.keys(missingProperties).length > 0) {
        await this.rollbackSchemaUpdates(notion, databaseId, missingProperties);
      }

      // Throw the error to indicate the failure
      throw new InternalServerErrorException(
        `Error creating Notion page: ${err.message}`,
      );
    }
  }

  private async rollbackSchemaUpdates(
    notion: any,
    databaseId: string,
    addedProperties: Record<string, any>,
  ): Promise<void> {
    const rollbackProperties: Record<string, any> = {};
    Object.keys(addedProperties).forEach((key) => {
      rollbackProperties[key] = null;
    });

    try {
      await notion.databases.update({
        database_id: databaseId,
        properties: rollbackProperties,
      });
    } catch (err) {
      console.error(
        `Failed to rollback database schema updates: ${err.message}`,
      );
    }
  }
}
