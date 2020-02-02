import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import Cryption from '../Providers/Cryption/Cryption.provider';
import { SendEmail } from '../Providers/Email/SendEmail.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, Cryption, SendEmail],
  exports: [UsersService],
})
export class UsersModule {}
