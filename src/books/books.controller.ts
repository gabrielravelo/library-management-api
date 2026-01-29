import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateBookDto } from './dto/update-book.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiBody,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Post()
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({
        summary: 'Create book',
        description:
            'Creates a new book associated with an existing author. (Roles: LIBRARIAN or ADMIN)',
    })
    @ApiBody({ type: CreateBookDto })
    @ApiCreatedResponse({
        description: 'Book created successfully.',
        type: Book,
    })
    @ApiBadRequestResponse({ description: 'Invalid input data.' })
    @ApiNotFoundResponse({ description: 'Author not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Get()
    @ApiOperation({
        summary: 'List books',
        description:
            'Returns all books with their author. (Requires authentication)',
    })
    @ApiOkResponse({
        description: 'Books fetched.',
        type: Book,
        isArray: true,
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    findAll() {
        return this.booksService.findAll();
    }

    @Patch(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({
        summary: 'Update book',
        description:
            'Partially updates an existing book. (Roles: LIBRARIAN or ADMIN)',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Book identifier',
    })
    @ApiOkResponse({ description: 'Book updated.', type: Book })
    @ApiBadRequestResponse({ description: 'Invalid input data.' })
    @ApiNotFoundResponse({ description: 'Book or author not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookDto: UpdateBookDto,
    ) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({
        summary: 'Delete book',
        description:
            'Deletes a book by its identifier. (Roles: LIBRARIAN or ADMIN)',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Book identifier',
    })
    @ApiOkResponse({
        description: 'Deletion confirmation.',
        schema: {
            type: 'object',
            properties: {
                deleted: { type: 'boolean', example: true },
            },
        },
    })
    @ApiNotFoundResponse({ description: 'Book not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.remove(id);
    }
}
