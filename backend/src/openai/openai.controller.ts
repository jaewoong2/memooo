import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { UseOptionalJwtAuthGuard } from 'src/auth/guard/use-optional-auth.guard';
import { TransformImageToTextDto } from './dto/transform-image.dto';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
const TransformToImageSchema = z.object({
  title: z.string(),
  description: z.string(),
  start_date: z.string(),
  end_date: z.string(),
});

@Controller('api/ai')
export class OpenAIController {
  constructor(private readonly openAiService: OpenaiService) {}

  @Post('text')
  @UseOptionalJwtAuthGuard({
    callback(user) {
      return { message: `${user.email}님 환영합니다.`, shouldPass: true };
    },
  })
  async transformImageToText(@Body() { imageUrl }: TransformImageToTextDto) {
    const { getTranslate: transformImage } = this.openAiService.useOpenAPI();

    const result = await transformImage(
      imageUrl,
      '이미지에서 내용, 시작 날짜, 종료 날짜를 있는 그대로 추출하여 JSON 형식으로 반환해주세요',
      1024,
      {
        response_format: zodResponseFormat(
          TransformToImageSchema,
          'TransformImageToText',
        ),
      },
    );

    return {
      ...result,
      message: {
        ...result.message,
        content: TransformToImageSchema.parse(
          JSON.parse(result.message.content),
        ),
      },
    };
  }
}
