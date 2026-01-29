import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { envSchema } from './config/joi.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: envSchema,
        }),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: configService.get<string>('ENV') === 'dev',
            }),          
        }),
        AuthModule,
        AuthorsModule,
        BooksModule,
        ReportsModule,
        SeedModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
