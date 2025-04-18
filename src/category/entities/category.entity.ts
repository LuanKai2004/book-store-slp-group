import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    comment: 'Tên danh mục sách, ví dụ: Khoa học, Lịch sử, Văn học',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Mô tả chi tiết về danh mục',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Slug URL thân thiện, ví dụ: van-hoc, lich-su',
  })
  slug: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
