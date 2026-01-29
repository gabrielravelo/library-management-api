import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { INITIAL_DATA } from './data/initial-data';
import { Author } from 'src/authors/entities/author.entity';

@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
    ) {}

    async runSeed() {
        await this.cleanDatabase();
        await this.loadUsers();
        await this.loadAuthors();
        return { message: 'Seed executed successfully' };
    }

    private async cleanDatabase() {
        const queryBuilder = this.userRepository.createQueryBuilder();
        await queryBuilder.delete().where({}).execute();
    }

    private async loadUsers() {
        const users = INITIAL_DATA.users;
        const insertPromises: Promise<User>[] = [];

        users.forEach((user) => {
            insertPromises.push(this.userRepository.save(this.userRepository.create(user)));
        });

        await Promise.all(insertPromises);
    }

    private async loadAuthors() {
        const authors = INITIAL_DATA.authors;
        const dbAuthors = authors.map(a => this.authorRepository.create(a));
        await this.authorRepository.save(dbAuthors);
    }

}
