import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordResetConfirmDto {
  @ApiProperty({
    description: 'Raw password reset token from email.',
    example: '8dca3a3b2f1f4f58...',
  })
  @IsString()
  @MinLength(16)
  @MaxLength(256)
  token: string;

  @ApiProperty({
    description: 'New account password.',
    example: 'NewStrongPass123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
