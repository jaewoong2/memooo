import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/auth.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY') ?? '',
          signOptions: {
            expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    GoogleStrategy,
    KakaoStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    AuthService,
    GoogleStrategy,
    KakaoStrategy,
  ],
})
export class AuthModule {}
