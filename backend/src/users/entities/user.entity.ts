import { Entity, Column, OneToMany } from 'typeorm';
import { Basic } from 'src/core/entities/basic.entitiy';
import { ApiProperty } from '@nestjs/swagger';
import { Habbit } from 'src/habbits/entiteis/habbit.entity';
import { OpenAIResponse } from 'src/openai/entities/openairesponse.entity';

export enum AuthProvider {
  GOOGLE = 'google',
  EMAIL = 'email',
  GITHUB = 'github',
  KAKAO = 'kakao',
  APPLE = 'apple',
}

@Entity()
export class User extends Basic {
  @ApiProperty()
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  userName: string;

  @ApiProperty()
  @Column({ default: null })
  access_token: string;

  @ApiProperty()
  @Column({ default: null })
  refresh_token: string;

  @ApiProperty({
    enum: AuthProvider,
    description: 'Authentication provider',
    example: AuthProvider.EMAIL,
  })
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.EMAIL,
  })
  provider: AuthProvider;

  @OneToMany(() => Habbit, (habbit) => habbit.user, { nullable: true })
  habbits: Habbit[]; // 사용자가 만든 습관들

  @OneToMany(() => OpenAIResponse, (openAiResponse) => openAiResponse.user, {
    nullable: true,
  })
  openAIResponses: OpenAIResponse;
}
