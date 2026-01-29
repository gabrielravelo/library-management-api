import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('authors/excel')
    @ApiOperation({
        summary: 'Export authors report (Excel)',
        description:
            'Generates and downloads the authors report as an Excel file. Requires JWT.',
    })
    @ApiOkResponse({
        description: 'Excel file generated.',
        content: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                {
                    schema: { type: 'string', format: 'binary' },
                },
        },
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
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
    @ApiOperation({
        summary: 'Export books report (Excel)',
        description:
            'Generates and downloads the books report as an Excel file. Requires JWT.',
    })
    @ApiOkResponse({
        description: 'Excel file generated.',
        content: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                {
                    schema: { type: 'string', format: 'binary' },
                },
        },
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
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
