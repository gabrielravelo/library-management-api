import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() registerDto: RegisterDto) {
        return this.userService.create(registerDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        return this.userService.findAll();
    }

    @Get(':uuid')
    @Roles(Role.ADMIN)
    findOneByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.userService.findOneByUuid(uuid);
    }
}
