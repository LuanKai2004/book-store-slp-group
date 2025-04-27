import { 
  Injectable, 
  OnModuleInit, 
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { ROLES } from '../shared/constants/roles.constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Tự động seed các role khi khởi động module
   */
  async onModuleInit(): Promise<void> {
    await this.seedRoles();
  }

  /**
   * Seed các role mặc định vào database
   */
  private async seedRoles(): Promise<void> {
    try {
      const existingRoles = await this.roleRepository.find();
      const rolesToCreate = Object.values(ROLES).filter(
        (role) => !existingRoles.some((r) => r.name === role.name),
      );

      if (rolesToCreate.length > 0) {
        await this.roleRepository.save(
          rolesToCreate.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description
          }))
        );
      }
    } catch (error) {
      throw new Error(`Failed to seed roles: ${error.message}`);
    }
  }

  /**
   * Tạo role mới
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const { name } = createRoleDto;
      
      // Kiểm tra role đã tồn tại
      const existingRole = await this.roleRepository.findOne({ where: { name } });
      if (existingRole) {
        throw new ConflictException(`Role ${name} already exists`);
      }

      return await this.roleRepository.save(createRoleDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create role');
    }
  }

  /**
   * Lấy tất cả roles
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  /**
   * Tìm role theo ID
   */
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  /**
   * Tìm role theo tên
   */
  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      throw new NotFoundException(`Role ${name} not found`);
    }
    return role;
  }

  /**
   * Cập nhật role
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  /**
   * Xóa role
   */
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    
    // Kiểm tra role có đang được sử dụng
    if (role.users?.length > 0) {
      throw new BadRequestException('Cannot delete role that is in use');
    }

    await this.roleRepository.remove(role);
  }
}