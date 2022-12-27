import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ClientDto } from '../dto/client.dto';
import { StudioDto } from '../dto/studio.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // studio endpoints

  @Post('studio/signup')
  studioSignup(@Body() dto: StudioDto) {
    return this.authService.signupAsStudio(dto);
  }

  @HttpCode(200)
  @Post('studio/signin')
  studioSignIn(@Body() dto: AuthDto) {
    return this.authService.signinAsStudio(dto);
  }

  // client endpoints

  @Post('client/signup')
  clientSignup(@Body() dto: ClientDto) {
    return this.authService.signupAsClient(dto);
  }

  @HttpCode(200)
  @Post('client/signin')
  clientSignIn(@Body() dto: AuthDto) {
    return this.authService.signinAsClient(dto);
  }
}
