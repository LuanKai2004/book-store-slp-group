import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { Review } from '../../review/entities/review.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('users') // @Entity('users') chỉ định tên bảng trong DB là "users"
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @Column({ nullable: true }) // Add this column
  phone?: string;

  // eager: true: Tự động load role khi load user
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  //cascade: true: Tự động lưu/xóa review khi user được lưu/xóa
  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews: Review[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
