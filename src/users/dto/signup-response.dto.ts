import { UserStatus } from '../domain/user-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({
    example: 'f8f6ea0e-cf6d-41f7-a13c-6ab9fba1e6ab',
  })
  id: string;

  @ApiProperty({
    example: 'alice@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'Alice',
  })
  name: string;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.PendingVerification,
  })
  status: UserStatus;

  @ApiProperty({
    example: '2026-04-22T20:00:00.000Z',
  })
  createdAt: Date;
}
