import { Injectable } from '@nestjs/common';
import { ClientDto } from '../dto/client.dto';
import { StudioDto } from '../dto/studio.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  // Studio handlers

  async signupAsStudio(dto: StudioDto) {
    console.log(dto);
    return 'Success! You signed up as a studio!';
  }

  async signinAsStudio(dto: AuthDto) {
    console.log(dto);
    return 'You signed in as a studio!';
  }

  // Client handlers

  async signupAsClient(dto: ClientDto) {
    console.log(dto);
    return 'Success! You signed up as a client!';
  }

  async signinAsClient(dto: AuthDto) {
    console.log(dto);
    return 'You signed in as a client!';
  }
}
