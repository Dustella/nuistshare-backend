import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

  constructor() {
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
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
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
      subject: 'Hello ✔', // Subject line
      text: `Code is ${code}`, // plain text body
      html: `<b>Code is ${code}</b>`, // html body
    });
    return info;
  }
}
