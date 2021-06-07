FROM node:12-alpine AS BUILD_IMAGE

RUN apk add --no-cache curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build
RUN rm -rf node_modules/
RUN yarn install --production --frozen-lockfile
RUN npm prune --production
RUN /usr/local/bin/node-prune
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map
RUN find node_modules -name "*.d.ts" -type f -delete

FROM node:12-alpine

RUN apk add tzdata && rm -rf /var/cache/apk/*

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

CMD ["node", "./dist/src/main.js"]
