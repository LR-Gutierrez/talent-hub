FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine AS production

ENV NODE_ENV=production

RUN apk add --no-cache tzdata gettext

COPY nginx.conf.template nginx.ssl.conf.template /etc/nginx/templates/

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD TEMPLATE="${SSL_ENABLED:+nginx.ssl.conf.template}"; TEMPLATE="${TEMPLATE:-nginx.conf.template}"; \
    envsubst '${BACKEND_URL}${DOMAIN}' < "/etc/nginx/templates/$TEMPLATE" > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
