import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/auth.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthProvider, User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { KaKaoRedirectRequestType } from 'src/core/types';

const REDIRECT_URL =
  process.env.NODE_ENV === 'local'
    ? 'http://localhost:3000'
    : 'https://bamtoly.com';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('notion/callback')
  async notionLogin(@Req() req) {
    console.log(req);
    return JSON.stringify(req);
  }

  @Get('notion/redirect')
  async notionRedirect(@Query('code') code: string) {
    const result = await this.authService.requestNotionAccessToken(code);

    return result;
  }

  @Get('kakao/login')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback() {}

  @Get('kakao/logout')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogoutCallback() {}

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoRedirect(
    @Req() req: KaKaoRedirectRequestType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!req.user) return null;

    const token = await this.authService.googleLogin(
      {
        user: {
          email: req.user.nickname,
          userName: `${req.user.nickname}`,
          photo: req.user.image,
          // provider: ,
        },
      },
      AuthProvider.KAKAO,
    );

    res.cookie('refresh_token', token.access_token, { httpOnly: true });
    res.redirect(`${REDIRECT_URL}/login?code=${token.access_token}`);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('oauth2/redirect/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const token = await this.authService.googleLogin(req, AuthProvider.GOOGLE);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    res.redirect(`${REDIRECT_URL}/login?code=${token.access_token}`);
  }

  @Get('google/refresh')
  @UseGuards(JwtAuthGuard)
  async googleRefresh(@Req() request: { user: User }) {
    return await this.authService.refreshAccessToken(request.user);
  }

  @Post('signup')
  async signUp(
    @Body()
    signUpDto: {
      email: string;
    },
  ) {
    const result = await this.authService.googleLogin(
      {
        user: {
          email: signUpDto.email,
          userName: signUpDto.email,
        },
      },
      AuthProvider.EMAIL,
    );

    return result;
  }

  @Post('login')
  @UseGuards(JwtAuthGuard)
  async login(@Req() request: { user: User }) {
    const user = await this.authService.validateUser(request.user.userName);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
