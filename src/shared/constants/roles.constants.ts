/**
 * Enum định nghĩa các vai trò trong hệ thống
 */
export enum RoleEnum {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

/**
 * Đối tượng chứa thông tin chi tiết về các vai trò
 */
export const ROLES = {
  ADMIN: {
    id: 1,
    name: RoleEnum.ADMIN,
    description: 'Quản trị viên hệ thống - Có toàn quyền truy cập và quản lý',
    level: 3, // Cấp độ ưu tiên cao nhất
  },
  STAFF: {
    id: 2,
    name: RoleEnum.STAFF,
    description: 'Nhân viên cửa hàng - Có quyền quản lý sản phẩm và đơn hàng',
    level: 2,
  },
  CUSTOMER: {
    id: 3,
    name: RoleEnum.CUSTOMER,
    description: 'Khách hàng - Chỉ có quyền truy cập cơ bản',
    level: 1,
  },
} as const;

/**
 * Kiểu dữ liệu cho thông tin vai trò
 */
export type RoleType = typeof ROLES[keyof typeof ROLES];