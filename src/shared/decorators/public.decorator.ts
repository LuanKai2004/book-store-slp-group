import { SetMetadata } from '@nestjs/common';

/**
 * Key metadata để đánh dấu endpoint public
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator để đánh dấu endpoint không yêu cầu xác thực
 * @example @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);