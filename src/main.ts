import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    const configService = app.get(ConfigService);

    const config = new DocumentBuilder()
        .setTitle('Library Management API')
        .setDescription('API para la gestión de libros, autores y usuarios con roles.')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document);

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.enableCors();

    const port = configService.getOrThrow<number>('PORT');
    await app.listen(port);
    logger.log(`App running in port ${port} 🚀`);
    logger.log(`Swagger running in api/v1/docs 📜`);
}
bootstrap();
