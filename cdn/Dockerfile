FROM php:8.2-cli

WORKDIR /app

COPY . /app

RUN mkdir -p /app/files /app/data && \
    chmod -R 755 /app/files /app/data

EXPOSE 8080

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t /app"]
