import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

// MAIL_MAILER=smtp
// MAIL_HOST=smtp.qcloudmail.com
// MAIL_PORT=465
// MAIL_USERNAME=noreply@example.com
// MAIL_PASSWORD=xxxx
// MAIL_ENCRYPTION=ssl
// MAIL_FROM_ADDRESS=noreply@example.com
// MAIL_FROM_NAME=xxxx

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private MAIL_FROM_ADDRESS: string;
  private MAIL_FROM_NAME: string;

  constructor(private prisma: PrismaService) {
    const {
      MAIL_HOST,
      MAIL_PORT,
      MAIL_USERNAME,
      MAIL_PASSWORD,
      MAIL_ENCRYPTION,
      MAIL_FROM_ADDRESS,
      MAIL_FROM_NAME,
    } = process.env;

    this.MAIL_FROM_ADDRESS = MAIL_FROM_ADDRESS;
    this.MAIL_FROM_NAME = MAIL_FROM_NAME;

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: parseInt(MAIL_PORT),
      secure: 'ssl' === MAIL_ENCRYPTION,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });
    this.transporter = transporter;
  }

  async sendCode(email: string, code: string) {
    const info = await this.transporter.sendMail({
      from: this.MAIL_FROM_ADDRESS, // sender address
      to: email, // list of receivers
      subject: 'Nuistshare Verification', // Subject line
      text: `Code is ${code}`, // plain text body
      html: `<b>Code is ${code}</b>`, // html body
    });
    return info;
  }

  async sendVerification(email: string) {
    // random generate code, make it always length 8
    const code = Math.random().toString(36).substr(2, 8);

    // send code to email
    await this.sendCode(email, code);

    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (user.email !== email) {
      throw new HttpException('Nice Try', HttpStatus.FORBIDDEN);
    }

    await this.prisma.emailVerify.create({
      data: {
        userId: user.id,
        code,
      },
    });
  }

  async doVerify(email: string, code: string): Promise<boolean> {
    const record = await this.prisma.emailVerify.findMany({
      where: {
        code: code,
      },
    });

    if (record.length === 0) {
      return false;
    }
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (record.map((item) => item.userId).find((id) => id === user.id)) {
      await this.prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          verified: true,
        },
      });

      return true;
    }
  }
}
