FROM node:18-bullseye as builder

WORKDIR /app
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version berry
COPY package.json ./
COPY yarn.lock ./
COPY patches/ patches/
RUN yarn install
COPY . .
RUN yarn build

FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./.nginx/nginx.conf.template /etc/nginx/templates/nginx.conf.template
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
COPY docker-entrypoint.sh /
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]