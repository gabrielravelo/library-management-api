import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorsController {
    constructor(private readonly authorsService: AuthorsService) {}

    @Post()
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    create(@Body() createAuthorDto: CreateAuthorDto) {
        return this.authorsService.create(createAuthorDto);
    }

    @Get()
    findAll() {
        return this.authorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.authorsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAuthorDto: UpdateAuthorDto,
    ) {
        return this.authorsService.update(id, updateAuthorDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.authorsService.remove(id);
    }
}
