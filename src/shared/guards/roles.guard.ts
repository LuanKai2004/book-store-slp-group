import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constants/roles.constants';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator'; // Thêm import này

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Kiểm tra endpoint public trước
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    // Lấy danh sách vai trò yêu cầu từ metadata
    const requiredRoles = this.reflector.get<RoleEnum[]>(
      ROLES_KEY, // Sử dụng constant đã import
      context.getHandler(),
    );
    
    // Nếu endpoint không yêu cầu role cụ thể
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra người dùng đã đăng nhập
    if (!user) {
      throw new UnauthorizedException('Vui lòng đăng nhập để tiếp tục');
    }

    // Kiểm tra vai trò người dùng
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập tài nguyên này',
      );
    }

    return true;
  }
}