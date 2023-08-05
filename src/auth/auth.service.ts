import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';

export interface Payload {
  sub: number;
  username: string;
  hashed_pass: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signJwt(user: Users) {
    const payload = {
      sub: user.id,
      username: user.name,
      hashed_pass: user.password.slice(0, 30),
      email: user.email,
    } as Payload;

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  /** 
@name checkJwt
@description checks if a jwt is valid
@param token token, can contain Bearer, usually from the authorization header
@returns payload if valid, throws error if invalid
*/
  async checkJwt(token: string) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload as Payload;
    } catch {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
