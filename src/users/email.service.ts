import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  sendVerificationEmail(email: string, verificationUrl: string): void {
    // Email provider integration (SES/SendGrid/etc.) will replace this.
    this.logger.log(
      `Verification email queued for ${email}. Link: ${verificationUrl}`,
    );
  }
}
