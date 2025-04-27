import { IsNotEmpty, IsEnum } from 'class-validator';
import { RoleEnum } from '../../shared/constants/roles.constants';

/**
 * Data Transfer Object (DTO) cho việc cập nhật vai trò người dùng
 */
export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsEnum(RoleEnum, { message: 'Vai trò không hợp lệ' })
  role: RoleEnum;
}