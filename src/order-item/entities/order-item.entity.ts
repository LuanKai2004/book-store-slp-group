import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Book, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  book: Book;

  @Column({ type: 'int', default: 1, comment: 'Số lượng sách' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Đơn giá tại thời điểm mua',
  })
  unitPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
