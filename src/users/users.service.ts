import { ConflictException, Injectable } from '@nestjs/common';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SignupDto } from './dto/signup.dto';
import { UserStatus } from './domain/user-status.enum';
import { PasswordHasherService } from './password-hasher.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasherService,
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

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}
