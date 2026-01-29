import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BooksModule } from 'src/books/books.module';
import { AuthorsModule } from '../authors/authors.module';

@Module({
    imports: [AuthorsModule, BooksModule],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}
