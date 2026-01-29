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
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiParam,
} from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Controller('authors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Authors')
@ApiBearerAuth()
export class AuthorsController {
    constructor(private readonly authorsService: AuthorsService) {}

    @Post()
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({
        summary: 'Create author',
        description: 'Create a new author (LIBRARIAN or ADMIN).',
    })
    @ApiBody({ type: CreateAuthorDto })
    @ApiCreatedResponse({ description: 'Author created.', type: Author })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    create(@Body() createAuthorDto: CreateAuthorDto) {
        return this.authorsService.create(createAuthorDto);
    }

    @Get()
    @ApiOperation({
        summary: 'List authors',
        description: 'List all authors (authenticated).',
    })
    @ApiOkResponse({ description: 'Authors fetched.', type: [Author] })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    findAll() {
        return this.authorsService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get author by ID',
        description: 'Retrieve a single author (authenticated).',
    })
    @ApiParam({
        name: 'id',
        description: 'Author ID',
        required: true,
        example: 1,
    })
    @ApiOkResponse({ description: 'Author found.', type: Author })
    @ApiNotFoundResponse({ description: 'Author not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.authorsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({
        summary: 'Update author',
        description: 'Update an author by ID (LIBRARIAN or ADMIN).',
    })
    @ApiParam({
        name: 'id',
        description: 'Author ID',
        required: true,
        example: 1,
    })
    @ApiBody({ type: UpdateAuthorDto })
    @ApiOkResponse({ description: 'Author updated.', type: Author })
    @ApiNotFoundResponse({ description: 'Author not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAuthorDto: UpdateAuthorDto,
    ) {
        return this.authorsService.update(id, updateAuthorDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: 'Delete author',
        description: 'Delete an author by ID (ADMIN).',
    })
    @ApiParam({
        name: 'id',
        description: 'Author ID',
        required: true,
        example: 1,
    })
    @ApiOkResponse({ description: 'Author removed.' })
    @ApiNotFoundResponse({ description: 'Author not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.authorsService.remove(id);
    }
}
