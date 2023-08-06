# Nuistshare Backend

Powered by Nest.js, Prisma and PostgreSQL.

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/Dustella/nuistshare-backend/build-docker.yaml)

## Description

[Nuistshare](https://nuistshare.cn) is a platform for sharing resources in Nanjing University of Information Science and Technology, developed by [Dustella](https://dustella.net)

This is the backend part of Nuistshare. The frontend part is [here](https://github.com/Dustella/nuistshare).

## Installation

Please make sure you have installed Node.js 16+. Recommanded is Node.js 20. The development environment is recommended to be VSCode.

```bash
$ pnpm install
# generate prisma client
$ pnpm prisma generate
```

Then, you should configure env correctly. The env file is `.env.example`. You should copy it to `.env` and fill in the correct values.

```text
# .env
DATABASE_URL="postgresql://user:pass@url:5432/dbname?schema=public"
JWT_SECRET="114514"
MAIL_MAILER=smtp
MAIL_HOST=smtp.qcloudmail.com
MAIL_PORT=465
MAIL_USERNAME=noreply@example.com
MAIL_PASSWORD=xxxx
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME=xxxx
QINIU_ACCESS_KEY='<Your Access Key>'
QINIU_SECRET_KEY='<Your Secret Key>'
QINIU_BUCKET='<Your Bucket Name>'
```

## Development

You should have eslint plugin installed in your editor.

```bash
# development
$ pnpm dev
# lint
$ pnpm lint
# format
$ pnpm format
```

## Build Docker Image

```bash
$ docker build -t nuistshare-backend .
# build docker
```

## License

AGPL-3.0

## Contribute

You can contribute to this project by opening issues or pull requests.  
If you have any questions, please contact me by tg @dustella
