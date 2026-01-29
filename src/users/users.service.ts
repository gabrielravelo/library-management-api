import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(registerDto: RegisterDto): Promise<User> {
        const user = this.userRepository.create(registerDto);
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({});
    }

    async findOneByUuid(uuid: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: uuid });
        if (!user) throw new NotFoundException(`User with ID ${uuid} not found.`)
        return user;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }

    async findOneByEmailWithPassword(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role', 'fullName']
        });
    }
}
