import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async login(email: string, password: string) {
    const userInDb = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!userInDb) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const match = await bcrypt.compare(password, userInDb.password);

    if (!match) {
      throw new HttpException('Password Error', HttpStatus.FORBIDDEN);
    }

    return await this.auth.signJwt(userInDb);
  }

  async register(email: string, password: string, username: string) {
    // check if user exists

    if (
      await this.prisma.users.findUnique({
        where: { email },
      })
    ) {
      throw new HttpException('User Email already exists', HttpStatus.CONFLICT);
    }

    if (
      await this.prisma.users.findUnique({
        where: { name: username },
      })
    ) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    // hash password
    const hashed_password = await bcrypt.hash(password, 10);
    // create user
    const user = await this.prisma.users.create({
      data: {
        email,
        password: hashed_password,
        name: username,
        nickname: username,
      },
    });

    return this.auth.signJwt(user);
  }
}
