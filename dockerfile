FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml /usr/src/app/
RUN corepack enable && pnpm i

COPY --chown=node:node . .
RUN pnpm run build \
    && pnpm prune --production

# ---

FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/server.js"]