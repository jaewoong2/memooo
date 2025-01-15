import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class NotionAuthDto {
  @IsString()
  readonly code: string;

  @IsString()
  @IsOptional()
  readonly redirectUrl?: string;

  @IsString()
  readonly access_token: string;
}

export class NotionPersonResponseDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class NotionUserResponseDto {
  @IsNotEmpty()
  @IsString()
  object: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar_url?: string | null;

  @IsNotEmpty()
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => NotionPersonResponseDto)
  person: NotionPersonResponseDto;
}

export class NotionOwnerResponseDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => NotionUserResponseDto)
  user: NotionUserResponseDto;
}

export class NotionTokenResponseDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  token_type: string;

  @IsNotEmpty()
  @IsString()
  bot_id: string;

  @IsNotEmpty()
  @IsString()
  workspace_name: string;

  @IsOptional()
  @IsString()
  workspace_icon?: string | null;

  @IsNotEmpty()
  @IsString()
  workspace_id: string;

  @ValidateNested()
  @Type(() => NotionOwnerResponseDto)
  owner: NotionOwnerResponseDto;

  @IsOptional()
  @IsString()
  duplicated_template_id?: string | null;

  @IsNotEmpty()
  @IsString()
  request_id: string;
}
