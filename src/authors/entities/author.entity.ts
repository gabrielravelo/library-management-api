import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: 0 })
    booksCount: number;

    // 1:N
    @OneToMany(() => Book, (book) => book.author)
    books: Book[];

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
