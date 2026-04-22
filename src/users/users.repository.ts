import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from './domain/user-status.enum';
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
    private readonly repository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  createUser(input: CreateUserInput): Promise<UserEntity> {
    const user = this.repository.create({
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: input.passwordHash,
      status: input.status,
    });

    return this.repository.save(user);
  }
}
