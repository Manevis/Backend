import { Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class SendEmail {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  sendVerificationEmail(user: User, activationCode: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'فعالسازی ایمیل',
      template: 'email-verification',
      context: {
        title: `فعالسازی ایمیل ${user.email}`,
        activationURL: `http://localhost:3000/registration/email-validation/${activationCode}`,
        email: user.email,
      },
    });
  }
}
