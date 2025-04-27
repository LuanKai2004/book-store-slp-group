import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object (DTO) cho việc cập nhật thông tin người dùng
 * Kế thừa tất cả thuộc tính từ CreateUserDto nhưng tất cả đều optional
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  phone?: string; // Add this property
}
