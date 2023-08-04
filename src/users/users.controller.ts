import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';
import { LoginForm } from './dto/form.dto';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService, private users: UsersService) {}

  @Post('/api/login')
  async login(@Body() req: LoginForm) {
    return await this.users.login(req.username, req.password);
  }
}
