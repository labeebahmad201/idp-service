import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SignupDto } from './dto/signup.dto';
import { UserStatus } from './domain/user-status.enum';
import { EmailService } from './email.service';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { PasswordHasherService } from './password-hasher.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly emailService: EmailService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(
      signupDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = this.passwordHasher.hash(signupDto.password);
    const user = await this.usersRepository.createUser({
      email: signupDto.email,
      name: signupDto.name.trim(),
      passwordHash,
      status: UserStatus.PendingVerification,
    });

    const rawVerificationToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawVerificationToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await this.usersRepository.createEmailVerificationToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const appBaseUrl = process.env.APP_BASE_URL ?? 'http://localhost:3002';
    const verificationUrl = `${appBaseUrl}/v1/email-verification?token=${rawVerificationToken}`;
    this.emailService.sendVerificationEmail(user.email, verificationUrl);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const verificationToken =
      await this.usersRepository.findValidEmailVerificationToken(tokenHash);

    if (!verificationToken) {
      throw new BadRequestException(
        'Verification token is invalid or expired.',
      );
    }

    const user = await this.usersRepository.findById(verificationToken.userId);
    if (!user) {
      throw new BadRequestException('Verification target user not found.');
    }

    await this.usersRepository.activateUser(user.id);
    await this.usersRepository.markEmailVerificationTokenConsumed(
      verificationToken.id,
    );
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    // Do not leak account existence.
    if (!user) {
      return;
    }

    const rawResetToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await this.usersRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const appBaseUrl = process.env.APP_BASE_URL ?? 'http://localhost:3002';
    const resetUrl = `${appBaseUrl}/reset-password?token=${rawResetToken}`;
    this.emailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async confirmPasswordReset(
    passwordResetConfirmDto: PasswordResetConfirmDto,
  ): Promise<void> {
    const tokenHash = this.hashToken(passwordResetConfirmDto.token);
    const passwordResetToken =
      await this.usersRepository.findValidPasswordResetToken(tokenHash);

    if (!passwordResetToken) {
      throw new BadRequestException(
        'Password reset token is invalid or expired.',
      );
    }

    const user = await this.usersRepository.findById(passwordResetToken.userId);
    if (!user) {
      throw new BadRequestException('Password reset target user not found.');
    }

    const passwordHash = this.passwordHasher.hash(
      passwordResetConfirmDto.newPassword,
    );
    await this.usersRepository.updatePasswordHash(user.id, passwordHash);
    await this.usersRepository.markPasswordResetTokenConsumed(
      passwordResetToken.id,
    );
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
