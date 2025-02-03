import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { TransformImageToTextDto } from './dto/transform-image.dto';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { Status } from './entities/openairesponse.entity';

const habitSchema = z.object({
  name: z.string(),
  checked: z.boolean(),
});

const TransformToImageSchema = z.object({
  title: z.string(),
  habits: z.array(habitSchema),
  date: z.string(),
});

@Controller('api/ai')
export class OpenAIController {
  constructor(private readonly openAiService: OpenaiService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findResponse(@Request() req, @Query('imageUrl') imageUrl: string) {
    const response = await this.openAiService.findContents({
      key: imageUrl,
      user: req.user,
    });
    return { ...response, contents: JSON.parse(response.contents) };
  }

  @Post('text')
  @UseGuards(JwtAuthGuard)
  async transformImageToText(
    @Request() req,
    @Body() { imageUrl }: TransformImageToTextDto,
  ) {
    const { getTranslate: transformImage } = this.openAiService.useOpenAPI();

    const result = await transformImage(
      imageUrl,
      '이미지에서 제목, 날짜 (YYYY-MM-DD), 습관들을 추출하여 JSON 형식으로 반환해주세요. 연도가 없으면 현재 년도(2025) 로 생각 해주세요.',
      1024,
      {
        response_format: zodResponseFormat(
          TransformToImageSchema,
          'TransformImageToText',
        ),
      },
    );

    const content = TransformToImageSchema.parse(
      JSON.parse(result.message.content),
    );

    await this.openAiService.saveContents({
      category: 'image',
      contents: JSON.stringify(content),
      status: Status.DONE,
      key: imageUrl,
      user: req.user,
    });

    return {
      ...result,
      message: {
        ...result.message,
      },
      content,
    };
  }
}
