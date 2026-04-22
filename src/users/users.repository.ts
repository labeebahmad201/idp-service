import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { UserStatus } from './domain/user-status.enum';
import { EmailVerificationTokenEntity } from './entities/email-verification-token.entity';
import { UserEntity } from './entities/user.entity';

type CreateUserInput = {
  email: string;
  name: string;
  passwordHash: string;
  status: UserStatus;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(EmailVerificationTokenEntity)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationTokenEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  createUser(input: CreateUserInput): Promise<UserEntity> {
    const user = this.usersRepository.create({
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: input.passwordHash,
      status: input.status,
    });

    return this.usersRepository.save(user);
  }

  createEmailVerificationToken(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<EmailVerificationTokenEntity> {
    const token = this.emailVerificationTokenRepository.create({
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      consumedAt: null,
    });

    return this.emailVerificationTokenRepository.save(token);
  }

  findValidEmailVerificationToken(
    tokenHash: string,
  ): Promise<EmailVerificationTokenEntity | null> {
    return this.emailVerificationTokenRepository.findOne({
      where: {
        tokenHash,
        consumedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async markEmailVerificationTokenConsumed(tokenId: string): Promise<void> {
    await this.emailVerificationTokenRepository.update(tokenId, {
      consumedAt: new Date(),
    });
  }

  async activateUser(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      status: UserStatus.Active,
    });
  }
}
