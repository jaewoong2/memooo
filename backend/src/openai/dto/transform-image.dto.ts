// src/users/dto/create-user.dto.ts
import { IsString } from 'class-validator';

export class TransformImageToTextDto {
  @IsString()
  imageUrl: string;
}
