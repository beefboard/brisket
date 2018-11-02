FROM node:10 as build
WORKDIR /build

COPY package-lock.json package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:10

WORKDIR /beefboard-web

ENV NODE_ENV=production

COPY package-lock.json package.json ./
RUN npm install

COPY --from=build /build/.nuxt .nuxt
COPY --from=build /build/server server
COPY --from=build /build/nuxt.config.js .

ENTRYPOINT [ "node", "/beefboard-web/server" ]
