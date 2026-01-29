import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
    @ApiProperty({
        description: 'Author first name',
        minLength: 2,
        maxLength: 50,
        example: 'Isaac',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        description: 'Author last name',
        minLength: 2,
        maxLength: 50,
        example: 'Asimov',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;
}
