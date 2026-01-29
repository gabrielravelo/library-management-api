import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password (min 6 characters)',
        example: 'strongPa$$w0rd',
    })
    @IsString()
    @MinLength(6)
    password: string;
}
