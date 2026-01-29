import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly UsersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const { email } = registerDto;

        const existingUser = await this.UsersService.findOneByEmail(email);
        if (existingUser) throw new ConflictException('Email already registered');

        const user = await this.UsersService.create(registerDto);

        return {
            message: 'User registered successfully',
            userId: user.id,
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.UsersService.findOneByEmailWithPassword(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                email: user.email,
                role: user.role,
                fullName: user.fullName
            }
        };
    }

}
