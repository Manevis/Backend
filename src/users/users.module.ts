import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import Cryption from '../Providers/Cryption/Cryption.provider';
import { SendEmail } from '../Providers/Email/SendEmail.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, Cryption, SendEmail],
})
export class UsersModule {}
