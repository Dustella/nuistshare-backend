import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
    private mailer: MailService,
  ) {}

  async login(email: string, password: string) {
    this.chenkValid({ email, password, username: email });
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

  chenkValid(
    info: Partial<{ email: string; password: string; username: string }>,
  ) {
    const { email, password, username } = info;
    if (!email || !password || !username) {
      throw new HttpException('Invalid Form', HttpStatus.BAD_REQUEST);
    }
  }

  async checkConflict(info: { email: string; username: string }) {
    const { email, username } = info;
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
  }

  async register(email: string, password: string, username: string) {
    // check conflict
    this.chenkValid({ email, password, username });
    await this.checkConflict({ email, username });

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

  async getUserAvatar(id: number) {
    const info = await this.prisma.users.findUnique({
      where: { id },
      select: {
        avatar: true,
      },
    });
    const url = info.avatar ?? 'https://nuistshare-cdn.dustella.net/R.png';
    return url;
  }

  async getUserRecord(id: number) {
    return await this.prisma.users.findUniqueOrThrow({
      where: { id },
      include: {
        UserFavourite: true,
        UserHistory: true,
      },
    });
  }

  async addUserFavourite(userId: number, archiveId: number) {
    const updateUser = this.prisma.users.update({
      where: { id: userId },
      data: {
        UserFavourite: {
          connect: [{ id: archiveId }],
        },
      },
    });

    const addCount = this.prisma.archive.update({
      where: { id: archiveId },
      data: {
        // increase favCount
        favCount: {
          increment: 1,
        },
      },
    });

    try {
      return await Promise.all([updateUser, addCount]);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async removeUserFavourite(userId: number, archiveId: number) {
    try {
      return await Promise.all([
        this.prisma.users.update({
          where: { id: userId },
          data: {
            UserFavourite: {
              disconnect: [{ id: archiveId }],
            },
          },
        }),
        this.prisma.archive.update({
          where: { id: archiveId },
          data: {
            // decrease favCount
            favCount: {
              decrement: 1,
            },
          },
        }),
      ]);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(email: string, newPassword: string) {
    const hashed_password = await bcrypt.hash(newPassword, 10);
    return await this.prisma.users.update({
      where: { email },
      data: {
        password: hashed_password,
      },
    });
  }

  async changeInfo(
    userId: number,
    newInfo: Partial<Omit<Users, 'id' | 'verified'>>,
  ) {
    // pick out the fields that can be changed
    const allowedFields = ['name', 'nickname', 'avatar', 'phone', 'email'];
    const keys = Object.keys(newInfo);
    const filtered = keys.filter((key) => allowedFields.includes(key));
    const commit = filtered.reduce((obj, key) => {
      obj[key] = newInfo[key];
      return obj;
    }, {});
    return await this.prisma.users.update({
      where: { id: userId },
      data: {
        ...commit,
      },
    });
  }
}
