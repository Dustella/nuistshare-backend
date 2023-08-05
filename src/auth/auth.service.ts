import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signJwt(user: Users) {
    const payload = {
      sub: user.id,
      username: user.name,
      hashed_pass: user.password.slice(0, 30),
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async checkJwt(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
