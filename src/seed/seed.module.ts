import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthorsModule,
        UsersModule,
    ],
    controllers: [SeedController],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule {}
