import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class BooksService {

    constructor(
        @InjectRepository(Book)
        private readonly booksRepository: Repository<Book>,

        private readonly authorsService: AuthorsService,

        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll() {
        return await this.booksRepository.find({ relations: ['author'] });
    }

    async update(id: number, updateBookDto: UpdateBookDto) {

        if(updateBookDto.authorId) {
            const author = await this.authorsService.findOne(updateBookDto.authorId);
            if(!author) {
                throw new NotFoundException(`Author with ID ${updateBookDto.authorId} not found.`);
            }
        }

        const book = await this.booksRepository.preload({ id, ...updateBookDto });
        if (!book) throw new NotFoundException(`Book #${id} not found.`);

        const updatedBook = await this.booksRepository.save(book);
        this.eventEmitter.emit('book.count.update', updateBookDto.authorId);
        return updatedBook;
    }

    async remove(id: number) {
        const book = await this.booksRepository.findOneBy({ id });
        if (!book) throw new NotFoundException(`Book #${id} not found`);

        await this.booksRepository.remove(book);

        this.eventEmitter.emit('book.count.update', book.authorId);
        return { deleted: true };
    }

    async create(createBookDto: CreateBookDto) {

        const { authorId } = createBookDto;

        const author = await this.authorsService.findOne( authorId );

        if (!author) {
            throw new NotFoundException(`Author with ID ${authorId} not found. Cannot create book.`);
        }

        const book = this.booksRepository.create(createBookDto);
        const savedBook = await this.booksRepository.save(book);

        this.eventEmitter.emit('book.count.update', savedBook.authorId);

        return savedBook;
    }

}

