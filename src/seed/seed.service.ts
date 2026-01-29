import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { INITIAL_DATA } from './data/initial-data';

@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async runSeed() {
        await this.cleanDatabase();
        await this.loadUsers();
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

}
