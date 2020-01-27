import { Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendEmail {
  constructor(private readonly configService: ConfigService) {
  }

  sendVerificationEmail(user: User) {

    console.log(
      `We sent an email to ${user.email} successfully.`,
    );
  }
}
