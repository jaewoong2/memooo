import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { IntegrationService } from './integration.service';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto, CreateEventResponseDto } from './dto/create-event.dto';
import { AuthroizationException } from 'src/core/filters/exception/service.exception';
import {
  AddPageDto,
  GetNotionDatabaseResponseDto,
} from './dto/notion-create-page.dto';

@Controller('api/integration')
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly userService: UsersService,
  ) {}

  @Get('notion/database/:id')
  @UseGuards(JwtAuthGuard)
  async getDatabaseSchema(
    @Req() request: { user: User },
    @Param() { id }: { id: string },
  ) {
    const user = await this.userService.findById(request.user.id);
    const notion = this.integrationService.getNotionClient(user.access_token);

    const properties = await this.integrationService.getDatabaseSchema(
      notion,
      id,
    );

    return plainToInstance(GetNotionDatabaseResponseDto, { properties });
  }

  @Get('notion/databases')
  @UseGuards(JwtAuthGuard)
  async listDatabases(@Req() request: { user: User }) {
    const user = await this.userService.findById(request.user.id);
    return this.integrationService.listDatabases(user.access_token);
  }

  @Post('notion/page')
  @UseGuards(JwtAuthGuard)
  async addPage(
    @Req() request: { user: User },
    @Body() addPageDto: Omit<AddPageDto, 'accessToken'>,
  ) {
    const user = await this.userService.findById(request.user.id);

    return this.integrationService.addPageWithCheckboxes({
      accessToken: user.access_token,
      ...addPageDto,
    });
  }

  @Post('calendar/add-event')
  @UseGuards(JwtAuthGuard)
  async addEventToCalendar(
    @Req() request: { user: User },
    @Body() body: Omit<CreateEventDto, 'accessToken'>,
  ) {
    const user = await this.userService.findById(request.user.id);
    const { summary, startTime, endTime, description } = body;

    // 실제 서비스라면, 현재 로그인된 사용자 식별이 필요
    const userTokens = user.access_token;

    if (!userTokens) {
      throw AuthroizationException();
    }

    // Calendar API 호출
    try {
      const event = await this.integrationService.createEvent({
        accessToken: user.access_token,
        refreshToken: user.refresh_token,
        description,
        summary,
        startTime,
        endTime,
      });

      return {
        message: '이벤트를 생성 했습니다.',
        event: plainToInstance(CreateEventResponseDto, event, {
          excludeExtraneousValues: true, // DTO에 정의되지 않은 속성 제거
        }),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
