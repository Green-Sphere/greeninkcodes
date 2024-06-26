# Stage 1: Build the Angular application
FROM node:18 AS builder

WORKDIR /src/app

COPY . .

RUN npm install
RUN npm run build --prod

# Stage 2: Serve the Angular application using nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /src/app/dist/greenink/* /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
