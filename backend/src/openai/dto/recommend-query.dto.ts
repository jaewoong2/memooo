// src/users/dto/create-user.dto.ts
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RecommendQueryDto {
  @IsString()
  key: string;

  @IsString()
  language: string;

  @Type(() => Number)
  @IsNumber()
  page: number;
}
