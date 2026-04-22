import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'User email address.',
  })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({
    example: 'Alice',
    description: 'Display name for the user profile.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({
    example: 'StrongPass123',
    minLength: 8,
    description: 'Plain-text password that will be hashed before storage.',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
