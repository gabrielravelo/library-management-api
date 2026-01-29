import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('authors/excel')
    async exportAuthos(@Res() res: Response) {
        const workbook = await this.reportsService.generateAuthorsExcel();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'authors_report.xlsx',
        );

        await workbook.xlsx.write(res);
        res.end();
    }

    @Get('books/excel')
    async exportBooks(@Res() res: Response) {
        const workbook = await this.reportsService.generateBooksExcel();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'books_report.xlsx',
        );

        await workbook.xlsx.write(res);
        res.end();
    }
}
