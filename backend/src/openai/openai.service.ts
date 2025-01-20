import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { authConfig } from 'src/core/config/auth.config';
import { OpenAIResponse } from './entities/openairesponse.entity';
import { EntityManager, Repository } from 'typeorm';
import { ResponseFormatJSONSchema } from 'openai/resources';

const PROMPT = `
<요청> 이미지를 보고, format에 맞게 응답해주세요

<배경> 
- 이미지를 보고, Notion Page에 체크박스로 된 속성에 체크 할 수 있도록 할 거임
- habit tracker를 위한, 어플리케이션 임.
- 이미지 및 기타 맥락이 분명하지 않다면, 가장 일반적인 상황임을 고려할 것
`;

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  openai: OpenAI;

  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
    @InjectRepository(OpenAIResponse)
    private readonly openAIRepository: Repository<OpenAIResponse>,
  ) {
    this.openai = new OpenAI({ apiKey: this.config.auth.openAiAPIKey });
  }

  async findContents({ key, user }: Pick<OpenAIResponse, 'key' | 'user'>) {
    const result = await this.openAIRepository.findOne({
      where: { key: key, user: { id: user.id } },
    });

    return result;
  }

  async saveContents({
    category,
    contents,
    status,
    key,
    user,
  }: Pick<
    OpenAIResponse,
    'category' | 'key' | 'contents' | 'status' | 'user'
  >) {
    const result = await this.findContents({ key, user });

    if (result) {
      return result;
    }

    return await this.openAIRepository.manager.transaction(
      async (manager: EntityManager) => {
        const existing = await manager.findOne(OpenAIResponse, {
          where: { key },
        });

        if (existing) {
          // 업데이트
          existing.category = category;
          existing.contents = contents;
          existing.status = status;
          existing.user = user;
          existing.user.id = user.id;
          return await manager.save(existing);
        } else {
          // 새로 저장
          const newContent = manager.create(OpenAIResponse, {
            category,
            contents,
            key,
            status,
            user: { id: user.id },
          });
          return await manager.save(newContent);
        }
      },
    );
  }

  useOpenAPI() {
    const getTranslate = async (
      description: string,
      prompt: string = PROMPT,
      max_tokens: number = 258,
      options?: { response_format: ResponseFormatJSONSchema },
    ) => {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `${PROMPT} \n ${prompt}`,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: "What's in this image?" },
              {
                type: 'image_url',
                image_url: {
                  url: description,
                },
              },
            ],
          },
        ],
        model: 'gpt-4o-mini',
        temperature: 1,
        max_tokens: max_tokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: !options ? { type: 'text' } : options.response_format,
      });

      return { ...completion.choices[0] };
    };

    return { getTranslate };
  }
}
