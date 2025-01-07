import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenAIResponse } from './entities/openairesponse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpenAIResponse])],
  controllers: [OpenAIController],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
