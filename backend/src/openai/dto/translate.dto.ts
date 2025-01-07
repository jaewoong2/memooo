// src/users/dto/create-user.dto.ts
import { IsArray } from 'class-validator';

export class TranslateDto {
  @IsArray()
  scripts: string[];
}
