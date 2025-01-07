import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calendar_v3, google } from 'googleapis';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly calendar = google.calendar('v3');
  private readonly auth = new google.auth.OAuth2();

  async createEvent({
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

      // 필요하면 만료 여부 체크 후 토큰 갱신 로직 추가
      // await oauth2Client.getAccessToken();
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
