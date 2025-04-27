import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.reviews, { nullable: false, onDelete: 'CASCADE' })
  book: Book;

  @Column({ type: 'int', width: 1, comment: 'Số sao đánh giá (1-5)' })
  rating: number;

  @Column({ type: 'text', comment: 'Nội dung bình luận', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
