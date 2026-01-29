import {
    IsEmail,
    IsString,
    MinLength,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class RegisterDto {
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

    @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
    @IsString()
    fullName: string;

    @ApiProperty({
        enum: Role,
        required: false,
        description: 'Optional user role; defaults to USER',
        example: Role.USER,
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
