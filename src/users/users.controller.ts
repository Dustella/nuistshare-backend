import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';
import { LoginForm, RegisterForm } from './dto/form.dto';

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
}
