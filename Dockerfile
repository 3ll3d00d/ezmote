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
# must be set externally
ARG CMDSERVER_IP_ARG
ENV CMDSERVER_IP=$CMDSERVER_IP_ARG

RUN rm /etc/nginx/conf.d/default.conf
COPY ./.nginx/nginx.conf.template /etc/nginx/templates/nginx.conf.template
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 80
