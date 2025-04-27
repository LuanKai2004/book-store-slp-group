import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

/**
 * Entity đại diện cho bảng roles trong database
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ comment: 'Khóa chính tự tăng' })
  id: number;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    unique: true,
    comment: 'Tên vai trò (admin, staff, customer)' 
  })
  name: string;

  @Column({ 
    type: 'text', 
    nullable: true,
    comment: 'Mô tả chi tiết vai trò' 
  })
  description: string;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'RESTRICT', // Ngăn xóa role nếu có user đang sử dụng
    onUpdate: 'CASCADE', // Cập nhật role_id trong bảng users nếu role.id thay đổi
  })
  users: User[];

  @CreateDateColumn({ 
    name: 'created_at',
    comment: 'Thời điểm tạo' 
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    name: 'updated_at',
    comment: 'Thời điểm cập nhật' 
  })
  updatedAt: Date;
}