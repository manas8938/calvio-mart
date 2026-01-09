import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  createSecret(): string {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret.base32;
  }

  generateOtpFromSecret(secret: string, stepSeconds = 30, digits = 6): string {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
      digits,
      step: stepSeconds,
    });
  }

  verifyOtp(secret: string, token: string, window = 0, stepSeconds = 30): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      step: stepSeconds,
      window,
    });
  }
}
