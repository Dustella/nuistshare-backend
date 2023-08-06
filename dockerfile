FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml prisma /usr/src/app/
RUN corepack enable && pnpm i && pnpm prisma generate

COPY --chown=node:node . .
RUN pnpm run build \
    && pnpm prune --production

# ---

FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/

CMD ["node", "dist/main.js"]
