import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../constants/roles.constants';

/**
 * Key metadata để lưu trữ danh sách vai trò được phép
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator để xác định vai trò được phép truy cập endpoint
 * @param roles Danh sách vai trò được phép
 * @example @Roles(RoleEnum.ADMIN, RoleEnum.STAFF)
 */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);