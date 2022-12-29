FROM nginx:alpine

# make the 'app' folder the current working directory
COPY dist /app/dist
COPY deploy/test/default.conf /etc/nginx/conf.d/default.conf
COPY deploy/test/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app/dist

