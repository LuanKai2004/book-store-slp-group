import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto'; // Thêm import DTO này
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Thêm guard JWT
import { RoleEnum } from '../shared/constants/roles.constants';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Swagger decorators

@ApiTags('Users') // Nhóm các API liên quan đến User trong Swagger UI
@ApiBearerAuth() // Chỉ định API cần token bearer
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng cả JWT và Roles guard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Trả về status code 201 khi tạo thành công
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Người dùng đã được tạo thành công' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dữ liệu không hợp lệ' 
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng (ADMIN only)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Trả về danh sách người dùng' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Không có quyền truy cập' 
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết người dùng' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Trả về thông tin người dùng' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Không tìm thấy người dùng' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id/role')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật vai trò người dùng (ADMIN only)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vai trò đã được cập nhật' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Không có quyền thực hiện' 
  })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, updateUserRoleDto.role);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng (ADMIN only)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Thông tin người dùng đã được cập nhật' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Không tìm thấy người dùng' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content cho xóa thành công
  @ApiOperation({ summary: 'Xóa người dùng (ADMIN only)' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Người dùng đã được xóa' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Không tìm thấy người dùng' 
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
  }
}