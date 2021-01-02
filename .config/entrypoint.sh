#!/bin/bash

certbot certonly --standalone -d timeasr.solova.com -n --agree-tos --expand
/usr/sbin/nginx -g "daemon off;"
