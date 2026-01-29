import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
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
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: 'Create user',
        description: 'Creates a new user (ADMIN only).',
    })
    @ApiBody({ type: RegisterDto })
    @ApiCreatedResponse({ description: 'User created.', type: User })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    create(@Body() registerDto: RegisterDto) {
        return this.userService.create(registerDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: 'List users',
        description: 'Returns all users (ADMIN only).',
    })
    @ApiOkResponse({ description: 'Users fetched.', type: [User] })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':uuid')
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: 'Get user by UUID',
        description: 'Returns a single user (ADMIN only).',
    })
    @ApiParam({ name: 'uuid', description: 'User UUID', required: true })
    @ApiOkResponse({ description: 'User found.', type: User })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token.' })
    @ApiForbiddenResponse({ description: 'Insufficient role.' })
    findOneByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.userService.findOneByUuid(uuid);
    }
}
