import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GoogleService } from './google.service';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto, CreateEventResponseDto } from './dto/create-event.dto';
import { AuthroizationException } from 'src/core/filters/exception/service.exception';

@Controller('api/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly userService: UsersService,
  ) {}

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
      const event = await this.googleService.createEvent({
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
