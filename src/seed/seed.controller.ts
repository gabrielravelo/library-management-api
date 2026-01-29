import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get()
    @ApiOperation({
        summary: 'Run seed',
        description: 'Executes the database seeding process.',
    })
    @ApiOkResponse({ description: 'Seed executed.' })
    executeSeed() {
        return this.seedService.runSeed();
    }
}
