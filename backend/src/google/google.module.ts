import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [GoogleController],
  providers: [GoogleService, UsersService],
})
export class GoogleModule {}
