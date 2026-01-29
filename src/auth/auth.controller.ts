import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new account with role USER.',
    })
    @ApiBody({ type: RegisterDto })
    @ApiCreatedResponse({ description: 'User registered successfully.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register({ ...registerDto, role: Role.USER }); // all new users has role USER
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'User login',
        description: 'Authenticates user and returns access token.',
    })
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ description: 'Login successful.' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
