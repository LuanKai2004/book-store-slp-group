import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { RoleEnum } from '../shared/constants/roles.constants';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles Management')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo vai trò mới (ADMIN only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vai trò đã được tạo' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Không có quyền thực hiện' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.STAFF)
  @ApiOperation({ summary: 'Lấy danh sách tất cả vai trò' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Danh sách vai trò' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.STAFF)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết vai trò' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Thông tin vai trò' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy vai trò' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin vai trò (ADMIN only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vai trò đã được cập nhật' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy vai trò' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa vai trò (ADMIN only)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Xóa thành công' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Không thể xóa vai trò đang được sử dụng' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}