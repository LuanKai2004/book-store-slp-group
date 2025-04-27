import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Hành động hệ thống, ví dụ: CREATE_BOOK, DELETE_ORDER, LOGIN',
  })
  action: string;

  @Column({
    type: 'text',
    comment: 'Chi tiết hành động hoặc dữ liệu liên quan',
  })
  detail: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Loại đối tượng được log, ví dụ: User, Book, Order',
  })
  entityType: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID của đối tượng cụ thể',
  })
  entityId: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Người thực hiện hành động (username, email...)',
  })
  actor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
