import { Exclude, Expose } from 'class-transformer';
import { AuthProvider } from '../entities/user.entity';
import { Habbit } from 'src/habbits/entiteis/habbit.entity';
import { OpenAIResponse } from 'src/openai/entities/openairesponse.entity';

export class CreateEventResponseDto {
  @Expose()
  avatar: string;
  @Expose()
  email: string;
  @Expose()
  userName: string;
  @Exclude()
  access_token: string;
  @Exclude()
  refresh_token: string;
  @Exclude()
  provider: AuthProvider;
  @Exclude()
  habbits: Habbit[]; // 사용자가 만든 습관들
  @Exclude()
  openAIResponses: OpenAIResponse;
}
