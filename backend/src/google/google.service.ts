import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calendar_v3, google } from 'googleapis';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  private readonly calendar = google.calendar('v3');
  private readonly auth = new google.auth.OAuth2();

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
}
