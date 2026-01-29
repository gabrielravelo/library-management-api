import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsDateString,
    IsISBN,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
    @ApiProperty({
        description: 'Book title',
        minLength: 3,
        example: 'The Name of the Wind',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'Publication date (YYYY-MM-DD)',
        format: 'date',
        example: '2024-01-15',
    })
    @IsDateString() // (YYYY-MM-DD)
    publishedDate: string;

    @ApiProperty({
        description: 'Valid ISBN code',
        example: '978-3-16-148410-0',
    })
    @IsISBN()
    isbn: string;

    @ApiProperty({
        description: 'Existing author identifier',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    authorId: number;
}
