// src/users/dto/create-user.dto.ts
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Status } from '../entities/openairesponse.entity';

export class RecommendDto {
  @IsString()
  script: string;

  @IsString()
  key: string;

  @IsString()
  category: string;

  @IsString()
  language: string;

  @Type(() => Number)
  @IsNumber()
  page: number;

  @Type(() => String)
  @IsString()
  status: Status;
}
