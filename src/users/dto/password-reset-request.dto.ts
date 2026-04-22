import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'Account email to request password reset for.',
  })
  @IsEmail()
  @MaxLength(320)
  email: string;
}
