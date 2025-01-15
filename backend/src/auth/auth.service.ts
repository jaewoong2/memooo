// src/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthProvider, User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interface/auth.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GoogleUser,
  LoginResponse,
  JwtPayload as JwtPayloadType,
} from './types';
import axios from 'axios';
import { authConfig } from 'src/core/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { NotionAuthDto, NotionTokenResponseDto } from './dto/notion-auth.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getNotionAccssToken({ access_token }: NotionAuthDto) {
    return access_token;
  }

  async requestNotionAccessToken(code: string) {
    try {
      const clientId = this.configService.auth.notion.client_id;
      const clientSecret = this.configService.auth.notion.client_secret;

      const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );

      const response = await firstValueFrom(
        this.httpService.post<NotionTokenResponseDto>(
          'https://api.notion.com/v1/oauth/token',
          {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.configService.auth.notion.login_redirect_url,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${encoded}`,
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          },
        ),
      );

      const responseData = plainToInstance(
        NotionTokenResponseDto,
        response.data,
      );

      return responseData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async refreshAccessToken({ id: userId }: Pick<User, 'id'>) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      client_id: this.configService.auth.google.client_id,
      client_secret: this.configService.auth.google.client_secret,
      refresh_token: user.refresh_token,
      grant_type: 'refresh_token',
    });

    const response = await axios.post(url, params);

    if (response.status === 200) {
      user.access_token = response.data.access_token;
      this.userRepository.save(user);
    }

    return user; // 새로운 AccessToken 반환
  }

  async findByEmailOrSave(
    targetUser: Partial<User> & { email: string },
  ): Promise<User> {
    try {
      const result = await this.usersService.createUser({
        email: targetUser.email,
        userName: targetUser.userName,
        avatar: targetUser.avatar ?? '',
        provider: targetUser.provider,
        access_token: targetUser.access_token,
        refresh_token: targetUser.refresh_token,
      });

      const user = await this.userRepository.findOne({
        where: { email: result.email },
      });

      return user;
    } catch (error) {
      console.error(error);
      throw new Error('사용자를 찾거나 생성하는데 실패하였습니다');
    }
  }

  async googleLogin(
    req: {
      user: Partial<GoogleUser>;
    },
    provider: AuthProvider,
  ): Promise<LoginResponse> {
    const {
      email,
      firstName,
      lastName,
      photo,
      userName,
      accessToken,
      refreshToken,
    } = req.user;

    const fullName: string = userName ?? `${firstName}${lastName}`;

    const user: User = await this.findByEmailOrSave({
      email: email,
      userName: fullName,
      avatar: photo,
      provider,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const payload: JwtPayloadType = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      provider,
    };

    return {
      id: user.id,
      userName: user.userName,
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(
    avartar: string,
    email: string,
    userName: string,
  ): Promise<{ access_token: string }> {
    const user = new User();
    user.avatar = avartar;
    user.userName = userName;
    user.email = email;
    const result = await this.usersService.createUser(user);

    const payload = {
      userName: user.userName,
      id: user.id,
      email: user.email,
      provider: result.provider,
    };

    return {
      ...result,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userName: string): Promise<User | null> {
    const user = await this.usersService.findOneByUserName(userName);

    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      userName: user.userName,
      id: user.id,
      provider: user.provider,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOneByUserName(payload.userName);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
