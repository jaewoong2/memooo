import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habbit } from './entiteis/habbit.entity';
import { Record } from './entiteis/record.entity';
import { HabbitsController } from './habbits.controller';
import { HabbitService } from './habbits.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habbit, Record, User])],
  controllers: [HabbitsController],
  providers: [HabbitService],
})
export class HabbitsModule {}
