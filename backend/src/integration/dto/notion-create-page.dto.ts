import { Expose, Exclude, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import dayjs from 'dayjs';

export class AddPageDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  databaseId: string;

  @IsNotEmpty()
  @IsString()
  pageTitle: string;

  @IsOptional()
  @IsString()
  pageContent?: string;

  @IsOptional()
  @IsString()
  @Transform((value) => {
    const date = new Date(value.value);
    return dayjs(date).format('YYYY-MM-DD');
  })
  date?: string; // New: Status property value

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]; // New: List of tag values

  @IsOptional()
  @IsArray()
  checkboxes?: { name: string; checked: boolean }[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentBlocks?: string[]; // New: Array of content block texts
}

@Exclude()
export class CreateNotionPageResponseDto {
  @Expose()
  url: string;
}

@Exclude() // 클래스 내의 모든 필드를 기본적으로 제외
export class NotionDatabaseDto {
  @Expose()
  object: string;

  @Expose()
  id: string;

  @Expose()
  @Transform(({ value }) => {
    // value는 원본 title 배열이며, 각 요소에서 plain_text만 추출
    if (Array.isArray(value)) {
      return value.map((item: any) => item.plain_text)[0];
    }
    return value;
  })
  title: string[];

  @Expose()
  url: string;
}

export class GetNotionDatabaseResponseDto {
  @Expose()
  @Transform(({ value }) => {
    // value는 Record<string, DatabasePropertyConfigResponse> 형태임
    return Object.entries(value).map(
      ([key, config]: [key: string, config: Record<string, any>]) => ({
        name: key,
        ...config,
      }),
    );
  })
  properties: { [key: string]: any }[];
}
