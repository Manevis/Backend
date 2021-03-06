import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result }: User = user;
      return result;
    }
    return null;
  }

  login({ password, ...user }) {
    const {
      uuid,
      phoneNumber,
      links,
      biography,
      avatar,
      status,
      createdAt,
      updatedAt,
      ...forSign
    } = user;
    return {
      token: this.jwtService.sign(forSign),
      user,
    };
  }
}
