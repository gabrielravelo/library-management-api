import { Injectable } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import * as ExcelJS from 'exceljs';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class ReportsService {
    constructor(
        private readonly authorsService: AuthorsService,
        private readonly booksService: BooksService
    ) {}

    async generateAuthorsExcel() {
        const authors = await this.authorsService.findAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Authors');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'First Name', key: 'firstName', width: 30 },
            { header: 'Last Name', key: 'lastName', width: 30 },
            { header: 'Books Published', key: 'booksCount', width: 20 },
        ];

        authors.forEach(({ id, firstName, lastName, booksCount }) => {
            worksheet.addRow({
                id,
                firstName,
                lastName,
                booksCount,
            });
        });

        return workbook;
    }

    async generateBooksExcel() {
        const books = await this.booksService.findAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'ISBN', key: 'isbn', width: 20 },
            { header: 'Published Date', key: 'date', width: 15 },
            { header: 'Author', key: 'author', width: 25 },
        ];

        books.forEach(({id, title, isbn, publishedDate, author }) => {
            worksheet.addRow({
                id,
                title,
                isbn,
                date: publishedDate,
                author: `${author.firstName} ${author.lastName}`
            });
        });

        return workbook;
    }
}
