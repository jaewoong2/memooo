import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [IntegrationController],
  providers: [IntegrationService, UsersService],
})
export class IntegrationModule {}
