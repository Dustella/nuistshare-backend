import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginForm, RegisterForm } from './dto/form.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class UsersController {
  constructor(private prisma: PrismaService, private users: UsersService) {}

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
  async getMe(@Req() req) {
    const { sub } = req.user;
    return await this.users.getUserRecord(sub);
  }

  // @UseGuards(AuthGuard)
  // @Put('/api/users/me')
}
