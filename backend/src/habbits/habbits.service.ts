import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  CreateHabbitDto,
  RecordHabbitDto,
  UpdateHabbitDto,
} from './dto/habbit.dto';
import { HabbitResponseDto } from './dto/habbit.dto';
import { Habbit } from './entiteis/habbit.entity';
import { Record } from './entiteis/record.entity';
import { PageMetaDto } from 'src/core/types/page-meta.dto';
import { PageDto } from 'src/core/types/page.dto';
import { EntityNotFoundException } from 'src/core/filters/exception/service.exception';
import { PageOptionsDto } from 'src/core/types/pagination-post.dto';

@Injectable()
export class HabbitService {
  private readonly logger = new Logger(HabbitService.name);
  private readonly ERROR_MESSAGES = {
    USER_NOT_FOUND: 'User not found',
    HABBIT_NOT_FOUND: 'Habbit not found',
    HABBIT_EXISTS: 'Habbit with this title already exists for this user',
  };

  constructor(
    @InjectRepository(Habbit)
    private readonly habbitRepository: Repository<Habbit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async recordHabbit(userId: User['id'], recordHabbitDto: RecordHabbitDto) {
    const user = await this.findUserById(userId);
    const habbit = await this.findOrCreate(recordHabbitDto.title, user.id);
    const record = this.recordRepository.create({
      habbit: { id: habbit.id },
      imageUrl: recordHabbitDto.imageUrl,
      date: recordHabbitDto.date,
      percentage: recordHabbitDto.percentage,
    });

    await this.recordRepository.save(record);

    return { message: `Save Record - ${habbit.title}` };
  }

  async createHabbit(
    userId: User['id'],
    createHabbitDto: CreateHabbitDto,
  ): Promise<HabbitResponseDto> {
    try {
      const user = await this.findUserById(userId);
      await this.checkHabbitExists(createHabbitDto.title, user);

      const habbit = this.habbitRepository.create({
        ...createHabbitDto,
        user,
      });

      const savedHabbit = await this.habbitRepository.save(habbit);
      return this.toResponseDto(savedHabbit);
    } catch (error) {
      this.logger.error(`Failed to create habbit: ${error.message}`);
      throw error;
    }
  }

  async findHabbit(
    userId: User['id'],
    title: Habbit['title'],
  ): Promise<HabbitResponseDto> {
    const habbit = await this.findHabbitByUserAndTitle(userId, title);
    return this.toResponseDto(habbit);
  }

  async paginate(
    pageOptionsDto: Partial<PageOptionsDto>,
    attach?: <T>(qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ): Promise<PageDto<Habbit>> {
    const qb = this.habbitRepository
      .createQueryBuilder('habbit')
      .leftJoinAndSelect('habbit.records', 'records')
      .leftJoinAndSelect('habbit.user', 'user')
      .orderBy('habbit.createdAt', 'DESC');
    //   .withDeleted();

    attach(qb)
      .orderBy('habbit.createdAt', 'DESC')
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip);

    // 결과를 가져오기
    const [habbits, total] = await qb.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        skip: pageOptionsDto.skip,
        page: pageOptionsDto.page,
        take: pageOptionsDto.take,
      },
      total,
    });

    const last_page = pageMetaDto.last_page;

    // const result = plainToInstance(GetEventResponseDto, events, {});

    if (habbits.length === 0) {
      return new PageDto(habbits, pageMetaDto);
    }

    if (last_page >= pageMetaDto.page) {
      return new PageDto(habbits, pageMetaDto);
    } else {
      throw EntityNotFoundException('해당 페이지는 존재하지 않습니다');
    }
  }

  async findAllHabbits(userId: User['id']) {
    try {
      const habbits = await this.habbitRepository
        .createQueryBuilder('habbit')
        .leftJoinAndSelect('habbit.records', 'records')
        .where('habbit.userId = :userId', { userId })
        .orderBy('habbit.createdAt', 'DESC')
        .getMany();

      return { data: habbits.map((habbit) => this.toResponseDto(habbit)) };
    } catch (error) {
      this.logger.error(`Failed to fetch habbits: ${error.message}`);
      throw error;
    }
  }

  async deleteHabbit(userId: User['id'], id: Habbit['id']): Promise<void> {
    const habbit = await this.findHabbitByUserAndId(userId, id);
    await this.habbitRepository.softRemove(habbit);
    this.logger.log(`Habbit ${id} deleted successfully`);
  }

  async updateHabbit(
    userId: User['id'],
    id: Habbit['id'],
    updateHabbitDto: UpdateHabbitDto,
  ): Promise<HabbitResponseDto> {
    try {
      const habbit = await this.findHabbitByUserAndId(userId, id);

      if (updateHabbitDto.group) {
        habbit.group = updateHabbitDto.group;
      }

      if (updateHabbitDto.title) {
        habbit.title = updateHabbitDto.title;
      }

      if (updateHabbitDto.icon) {
        habbit.icon = updateHabbitDto.icon;
      }

      const updatedHabbit = await this.habbitRepository.save(habbit);

      return this.toResponseDto(updatedHabbit);
    } catch (error) {
      this.logger.error(`Failed to update habbit: ${error.message}`);
      throw error;
    }
  }

  // Private helper methods
  private async findUserById(userId: User['id']): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(this.ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  private async checkHabbitExists(title: string, user: User): Promise<void> {
    const existingHabbit = await this.habbitRepository.findOne({
      where: { title, user },
    });

    if (existingHabbit) {
      throw new BadRequestException(this.ERROR_MESSAGES.HABBIT_EXISTS);
    }
  }

  private async findHabbitByUserAndId(
    userId: User['id'],
    id: Habbit['id'],
  ): Promise<Habbit> {
    const habbit = await this.habbitRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!habbit) {
      throw new NotFoundException(this.ERROR_MESSAGES.HABBIT_NOT_FOUND);
    }
    return habbit;
  }

  private async findHabbitByUserAndTitle(
    userId: User['id'],
    title: string,
  ): Promise<Habbit> {
    const habbit = await this.habbitRepository.findOne({
      where: { user: { id: userId }, title },
      relations: ['records'],
    });

    if (!habbit) {
      throw new NotFoundException(this.ERROR_MESSAGES.HABBIT_NOT_FOUND);
    }

    return habbit;
  }

  private toResponseDto(habbit: Habbit): HabbitResponseDto {
    return {
      id: habbit.id,
      title: habbit.title,
      icon: habbit.icon,
      group: habbit.group,
      records: habbit.records,
      createdAt: habbit.createdAt,
      updatedAt: habbit.updateAt,
    };
  }

  private async findOrCreate(
    title: Habbit['title'],
    userId: User['id'],
  ): Promise<Habbit> {
    const repository = this.habbitRepository;

    // 1. Habit 찾기
    let habit = await repository.findOne({
      where: { title, user: { id: userId } },
      relations: ['user'],
    });

    // 2. 없으면 생성
    if (!habit) {
      habit = repository.create({
        title,
        user: { id: userId } as User, // 관계 설정
      });

      await repository.save(habit);
    }

    return habit;
  }
}
