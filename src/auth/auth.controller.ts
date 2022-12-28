import { Body, Controller, Post, HttpCode, Param } from '@nestjs/common';
import { userType } from '../types';
import { ClientDto } from '../dto/client.dto';
import { StudioDto } from '../dto/studio.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('studio/signup')
  studioSignup(@Body() dto: StudioDto) {
    return this.authService.signupAsStudio(dto);
  }

  @Post('client/signup')
  clientSignup(@Body() dto: ClientDto) {
    return this.authService.signupAsClient(dto);
  }

  @HttpCode(200)
  @Post(':type/signin')
  studioSignIn(@Body() dto: AuthDto, @Param('type') type: userType) {
    return this.authService.signin(dto, type);
  }
}
