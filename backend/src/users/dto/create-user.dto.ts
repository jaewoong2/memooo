// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AuthProvider, User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  avatar: User['avatar'];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  userName?: User['userName'];

  @IsString()
  @IsNotEmpty()
  email: User['email'];

  @IsEnum(AuthProvider)
  @IsOptional()
  provider: User['provider'];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  access_token: User['access_token'];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  refresh_token: User['refresh_token'];
}
