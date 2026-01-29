import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;
}
