FROM nginx:1.15-alpine

LABEL maintainer="Ezequiel Zarate"

WORKDIR /

RUN rm -rf /usr/share/nginx/html/*
COPY dist/prueba-angular /usr/share/nginx/html

EXPOSE 80

CMD nginx -g 'daemon off;'
