import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Author } from '../../authors/entities/author.entity';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'date' }) // YYYY-MM-DD
    publishedDate: string;

    @Column()
    isbn: string;

    // N:1
    @ManyToOne(() => Author, (author) => author.books, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'authorId' })
    author: Author;

    @Column()
    authorId: number;
}
