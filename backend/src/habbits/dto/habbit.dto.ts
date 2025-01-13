import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Record } from '../entiteis/record.entity';
import { Habbit } from '../entiteis/habbit.entity';
import { Type } from 'class-transformer';

export class CreateHabbitDto {
  @IsNotEmpty()
  @IsString()
  title: Habbit['title'];

  @IsNotEmpty()
  @IsString()
  icon: Habbit['icon'];

  @IsNotEmpty()
  @IsString()
  group: Habbit['group'];
}

export class UpdateHabbitDto {
  @IsOptional()
  @IsString()
  title?: Habbit['title'];

  @IsOptional()
  @IsString()
  icon?: Habbit['icon'];

  @IsOptional()
  @IsString()
  group?: Habbit['group'];
}

export class HabbitResponseDto {
  id: Habbit['id'];
  title: string;
  icon: Habbit['icon'];
  group: string;
  records: Record[];
  createdAt: Date;
  updatedAt: Date;
}

export class RecordHabbitDto {
  @Type(() => String)
  @IsString()
  title: Habbit['title'];

  @Type(() => String)
  @IsString()
  imageUrl: Record['imageUrl'];

  @Type(() => Date)
  @IsDate()
  date: Record['date'];

  @Type(() => Number)
  @IsNumber()
  percentage: Record['percentage'];
}

export class FindAllHabbitQueryDto {
  @IsOptional()
  @IsString()
  title?: Habbit['title'];

  @IsOptional()
  @IsString()
  group?: Habbit['group'];

  @IsOptional()
  @IsString()
  updateAt?: Habbit['updateAt'];

  @IsOptional()
  @IsNumber()
  userId?: Habbit['user']['id'];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number = 10;
}
