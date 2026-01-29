import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Post()
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Patch(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookDto: UpdateBookDto
    ) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.remove(id);
    }
}
