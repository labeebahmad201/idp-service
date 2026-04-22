import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('v1')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user account.',
  })
  @ApiCreatedResponse({
    description: 'Signup succeeds and user is created.',
    type: SignupResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email address is already registered.',
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
    return this.usersService.signup(signupDto);
  }

  @ApiOperation({
    summary: 'Verify email with a token sent during signup.',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Raw email verification token.',
  })
  @ApiOkResponse({
    description: 'Email is verified successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Verification token is missing, invalid, or expired.',
  })
  @Get('email-verification')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Query('token') token?: string,
  ): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required.');
    }

    await this.usersService.verifyEmail(token);
    return { message: 'Email verified successfully.' };
  }
}
