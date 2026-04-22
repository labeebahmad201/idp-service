import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailVerificationTokenEntity } from './entities/email-verification-token.entity';
import { UserEntity } from './entities/user.entity';
import { PasswordHasherService } from './password-hasher.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailVerificationTokenEntity]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    PasswordHasherService,
    EmailService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
