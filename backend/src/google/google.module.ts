import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GoogleController],
  providers: [GoogleService, UsersService],
})
export class GoogleModule {}