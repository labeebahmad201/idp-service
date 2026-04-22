import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
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
}
