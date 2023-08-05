import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('/api/is-logged-in')
  async isLoggedIn(@Req() req) {
    const header = req.headers.authorization;
    // remove Baerer
    const token = header.slice(7);
    if (!token) return false;
    return this.auth.checkJwt(token);
  }
}
