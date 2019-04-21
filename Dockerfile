FROM node:10-alpine as base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base as build
RUN npm run setup
COPY . .
RUN npm run build

FROM base as run
ENV NODE_ENV="production"
RUN npm ci
COPY --from=build /app/dist/main.js ./migrate.js
VOLUME /project

ENTRYPOINT ["/app/migrate.js"]
CMD ["--help"]
