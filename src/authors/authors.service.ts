import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
    private readonly logger = new Logger(AuthorsService.name);

    constructor(
        @InjectRepository(Author)
        private readonly authorsRepository: Repository<Author>,
    ) {}

    async create(createAuthorDto: CreateAuthorDto) {
        const author = this.authorsRepository.create(createAuthorDto);
        return await this.authorsRepository.save(author);
    }

    async findAll() {
        return await this.authorsRepository.find({ relations: ['books'] });
    }

    async findOne(id: number) {
        const author = await this.authorsRepository.findOne({
            where: { id },
            relations: ['books'],
        });
        if(!author) throw new NotFoundException(`Author #${id} not found.`);
        return author;
    }

    async update(id: number, updateAuthorDto: UpdateAuthorDto) {
        const author = await this.authorsRepository.preload({ id, ...updateAuthorDto });
        if (!author) throw new NotFoundException(`Author #${id} not found`);
        return await this.authorsRepository.save(author);
    }

    async remove(id: number) {
        const author = await this.findOne(id);
        return await this.authorsRepository.remove(author);
    }

    @OnEvent('book.count.update')
    async handleBookCountUpdate(authorId: number) {
        this.logger.log(`🔃 Updating book count for author ID: ${authorId}`);

        try {
            const author = await this.authorsRepository.findOne({
                where: { id: authorId },
                relations: ['books'],
            });

            if(author) {
                author.booksCount = author.books.length;
                await this.authorsRepository.save(author);
                this.logger.log(`✅ New count for ${author.firstName}: ${author.booksCount}`)
            }
        } catch (error){
            this.logger.error(`❌ Failed to update book count: ${error.message}`);
        }
    }
}
