FROM nginx:latest

COPY ./dist /usr/share/nginx/html
COPY .config/entrypoint.sh /entrypoint.sh
COPY .config/timeasr.nginx.conf /etc/nginx/conf.d

RUN apt-get update
RUN apt-get --yes install certbot
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "../entrypoint.sh" ]