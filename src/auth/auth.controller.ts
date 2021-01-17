import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    if (!authCredentialsDto.username || !authCredentialsDto.password)
      throw new BadRequestException('Please provide all necessary credentials');
    return this.authService.signIn(authCredentialsDto);
  }
}
