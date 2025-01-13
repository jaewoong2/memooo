import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { HabbitService } from './habbits.service';
import {
  CreateHabbitDto,
  FindAllHabbitQueryDto,
  RecordHabbitDto,
  UpdateHabbitDto,
} from './dto/habbit.dto';
import { UseOptionalJwtAuthGuard } from 'src/auth/guard/use-optional-auth.guard';

@Controller('api/habbit')
export class HabbitsController {
  constructor(private readonly habbitService: HabbitService) {}

  @Post('record')
  @UseGuards(JwtAuthGuard)
  async createRecord(@Request() req, @Body() recordHabbitDto: RecordHabbitDto) {
    const userId = req.user.id;
    return await this.habbitService.recordHabbit(userId, recordHabbitDto);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createHabbit(@Request() req, @Body() createHabbitDto: CreateHabbitDto) {
    const userId = req.user.id; // JWT에서 추출된 사용자 ID
    return await this.habbitService.createHabbit(userId, createHabbitDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findHabbit(@Request() req, @Query('title') title: string) {
    const userId = req.user.id;
    return await this.habbitService.findHabbit(userId, title);
  }

  @Get('all')
  @UseOptionalJwtAuthGuard({ pass: true })
  async findAllHabbit(@Request() req, @Query() query: FindAllHabbitQueryDto) {
    const result = await this.habbitService.paginate(query, (qb) => {
      if (query?.title) {
        qb.andWhere('LOWER(habbit.title) LIKE LOWER(:title)', {
          title: `%${query?.title}%`,
        });
      }

      if (query?.group) {
        qb.andWhere('habbit.group LIKE :group', {
          group: `%${query?.group}%`,
        });
      }

      qb.andWhere('habbit.userId = :userId', {
        userId: `${req.user?.id ?? -1}`,
      });

      return qb;
    });
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteHabbit(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.habbitService.deleteHabbit(userId, +id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateHabbit(
    @Request() req,
    @Param('id') id: string,
    @Body() updateHabbitDto: UpdateHabbitDto,
  ) {
    const userId = req.user.id;
    return await this.habbitService.updateHabbit(userId, +id, updateHabbitDto);
  }
}
