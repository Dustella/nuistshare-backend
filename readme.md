# Nuistshare Backend

Powered by Nestjs

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
