import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsDateString,
    IsISBN,
    MinLength,
} from 'class-validator';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsDateString() // (YYYY-MM-DD)
    publishedDate: string;

    @IsISBN()
    isbn: string;

    @IsNumber()
    @IsNotEmpty()
    authorId: number;
}
