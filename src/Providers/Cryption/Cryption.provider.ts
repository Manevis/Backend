import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export default class Cryption {
  private readonly salt: string;
  private readonly algorithm: string = 'aes-256-cbc';
  private readonly IV_LENGTH: number = 16;
  constructor(private readonly configService: ConfigService) {
    this.salt = configService.get<string>('CRYPTO_SALT');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.salt),
      iv,
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text) {
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.salt),
        iv,
      );
      let decrypted = decipher.update(encryptedText);

      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    } catch {
      return null;
    }
  }
}
