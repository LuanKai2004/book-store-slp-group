import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({ example: 'senior_manager', description: 'Tên vai trò mới' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}