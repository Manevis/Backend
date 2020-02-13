import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth-strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as env from 'dotenv';
import { JwtStrategy } from './auth-strategy/jwt-strategy';
env.config();

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
