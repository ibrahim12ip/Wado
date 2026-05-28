FROM php:8.2-apache

RUN docker-php-ext-install -j$(nproc) pdo_mysql && \
    a2enmod rewrite

COPY . /var/www/html

RUN chmod -R 755 /var/www/html/files /var/www/html/data && \
    chown -R www-data:www-data /var/www/html/files /var/www/html/data

EXPOSE 80

CMD ["apache2-foreground"]
