import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'manager', description: 'Tên vai trò' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'Quản lý hệ thống', description: 'Mô tả vai trò' })
  @IsOptional()
  @IsString()
  description?: string;
}