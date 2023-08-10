import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginForm, RegisterForm } from './dto/form.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Users } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Controller()
export class UsersController {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
    private mailer: MailService,
  ) {}

  @Post('/api/login')
  async login(@Body() req: LoginForm) {
    const { email, password } = req;
    return this.users.login(email, password);
  }

  @Post('/api/register')
  async register(@Body() req: RegisterForm) {
    const { email, password, username } = req;
    return this.users.register(email, password, username);
  }

  @UseGuards(AuthGuard)
  @Get('/api/users/me')
  async getMe(@Req() req: any) {
    const { sub } = req.user;
    const info = await this.users.getUserRecord(sub);
    // prune password from info
    delete info.password;
    return info;
  }

  @UseGuards(AuthGuard)
  @Post('api/users/fav')
  async addFav(@Req() req: any, @Query('archive_id') archive_id: string) {
    const { sub } = req.user;
    return await this.users.addUserFavourite(sub, parseInt(archive_id));
  }

  @UseGuards(AuthGuard)
  @Delete('api/users/fav')
  async removeFav(@Req() req: any, @Query('archive_id') archive_id: string) {
    const { sub } = req.user;
    return await this.users.removeUserFavourite(sub, parseInt(archive_id));
  }

  @UseGuards(AuthGuard)
  @Put('api/users/me')
  async updateMe(@Req() req: any, @Body() body: Users) {
    const { sub } = req.user;
    return await this.users.changeInfo(sub, body);
  }

  @Put('/api/users/me/password')
  async changePassword(
    @Req() req: any,
    @Body() body: { email: string; code: string; password: string },
  ) {
    const { email, code, password } = body;
    try {
      const verify = await this.mailer.doVerify(email, code);
      if (verify) {
        await this.users.changePassword(email, password);
        return { message: 'ok' };
      } else {
        return { message: 'wrong code' };
      }
    } catch {
      return { message: 'error' };
    }
  }
  // @UseGuards(AuthGuard)

  // @UseGuards(AuthGuard)
  // @Put('/api/users/me')
}
