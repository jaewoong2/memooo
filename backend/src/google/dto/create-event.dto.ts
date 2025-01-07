// Create Event Dto
// accessToken: string,
// summary: string,
// startTime: string,

import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsOptional()
  readonly accessToken: string;

  @IsString()
  @IsOptional()
  readonly summary: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly startTime: string;

  @IsString()
  @IsOptional()
  readonly endTime: string;
}

export class CreateEventResponseDto {
  @Exclude()
  readonly kind: string;

  @Exclude()
  readonly etag: string;

  @Expose()
  readonly id: string;

  @Expose()
  readonly status: string;

  @Expose()
  readonly htmlLink: string;

  @Expose()
  readonly created: string;

  @Expose()
  readonly updated: string;

  @Expose()
  readonly summary: string;

  @Expose()
  readonly description: string;

  @Exclude()
  readonly creator: {
    email: string;
    self: boolean;
  };

  @Exclude()
  readonly organizer: {
    email: string;
    self: boolean;
  };

  @Expose()
  readonly start: {
    dateTime: string;
    timeZone: string;
  };

  @Expose()
  readonly end: {
    dateTime: string;
    timeZone: string;
  };

  @Exclude()
  readonly iCalUID: string;

  @Exclude()
  readonly sequence: number;

  @Exclude()
  readonly reminders: {
    useDefault: boolean;
  };

  @Exclude()
  readonly eventType: string;
}
