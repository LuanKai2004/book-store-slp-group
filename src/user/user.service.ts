import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { RoleEnum, ROLES } from '../shared/constants/roles.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  /**
   * Tạo người dùng mới
   * @param createUserDto DTO chứa thông tin tạo người dùng
   * @returns Promise<User>
   * @throws ConflictException nếu email đã tồn tại
   * @throws NotFoundException nếu không tìm thấy role mặc định
   * @throws InternalServerErrorException nếu có lỗi server
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password } = createUserDto;
      const trimmedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim().normalize('NFKC'); // Chuẩn hóa mật khẩu
  
      console.log('[REGISTER] Incoming createUserDto:', createUserDto);
      console.log('[REGISTER] Trimmed Email:', trimmedEmail);
      console.log('[REGISTER] Normalized Password:', normalizedPassword);
      console.log('[REGISTER] Password Length:', normalizedPassword.length);
  
      // Validate password
      if (!normalizedPassword || normalizedPassword.length < 6) {
        console.log('[REGISTER] Invalid password format');
        throw new ConflictException('Password must be at least 6 characters');
      }
  
      console.log('[REGISTER] Raw Password:', JSON.stringify(normalizedPassword));
      console.log('[REGISTER] Password Length:', normalizedPassword.length);
  
      console.log('[REGISTER] Checking if user exists...');
      const existingUser = await this.findByEmail(trimmedEmail);
      if (existingUser) {
        console.log('[REGISTER] User with this email already exists');
        throw new ConflictException('Email already exists');
      }
  
      console.log('[REGISTER] Getting default role...');
      const defaultRole = await this.roleService.findOne(ROLES.CUSTOMER.id);
      if (!defaultRole) {
        console.log('[REGISTER] Default role not found');
        throw new NotFoundException('Default role not found');
      }
  
      console.log('[REGISTER] Hashing password...');
      const hashedPassword = await bcrypt.hash(normalizedPassword, this.SALT_ROUNDS);
      console.log('[REGISTER] Generated Hash Before Save:', hashedPassword);
  
      console.log('[REGISTER] Creating user...');
      const { name } = createUserDto;
      const user = this.userRepository.create({
        name,
        email: trimmedEmail,
        password: hashedPassword,
        role: defaultRole,
      });
  
      const savedUser = await this.userRepository.save(user);
      console.log('[REGISTER] Saved User Hash:', savedUser.password);
      console.log('[REGISTER] User created successfully:', {
        id: savedUser.id,
        email: savedUser.email,
        passwordHash: savedUser.password,
      });
  
      return savedUser;
    } catch (error) {
      console.error('[REGISTER ERROR]', error);
      throw error;
    }
  }


  /**
   * Cập nhật vai trò của người dùng
   * @param userId ID người dùng
   * @param roleName Tên vai trò mới
   * @returns Promise<User>
   * @throws NotFoundException nếu không tìm thấy user hoặc role
   */
  async updateRole(userId: number, roleName: RoleEnum): Promise<User> {
    try {
      const user = await this.findOne(userId);
      let role: Role;
      
      // Find role ID by name
      if (roleName === RoleEnum.ADMIN) {
        role = await this.roleService.findOne(ROLES.ADMIN.id);
      } else if (roleName === RoleEnum.STAFF) {
        role = await this.roleService.findOne(ROLES.STAFF.id);
      } else if (roleName === RoleEnum.CUSTOMER) {
        role = await this.roleService.findOne(ROLES.CUSTOMER.id);
      } else {
        throw new NotFoundException(`Role ${roleName} not found`);
      }

      if (!role) {
        throw new NotFoundException(`Role ${roleName} not found`);
      }

      // Không cho phép thay đổi role của admin
      if (user.role.name === RoleEnum.ADMIN) {
        throw new BadRequestException('Cannot change role of admin user');
      }

      user.role = role;
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user role');
    }
  }

  /**
   * Lấy tất cả người dùng
   * @returns Promise<User[]>
   */
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({ 
        relations: ['role'],
        select: ['id', 'name', 'email', 'avatar', 'createdAt', 'updatedAt'] // Không trả về password
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  /**
   * Tìm người dùng theo ID
   * @param id ID người dùng
   * @returns Promise<User>
   * @throws NotFoundException nếu không tìm thấy
   */
  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ 
        where: { id }, 
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  /**
   * Tìm người dùng theo email (dùng cho auth)
   * @param email Email người dùng
   * @returns Promise<User | undefined>
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      console.log('[FIND BY EMAIL] Searching for:', trimmedEmail);
      
      const user = await this.userRepository.findOne({
        where: { email: trimmedEmail },
        relations: ['role'],
        select: ['id', 'email', 'password', 'name', 'role']
      });
  
      if (!user) {
        console.log('[FIND BY EMAIL] User not found');
        return null;
      }
  
      console.log('[FIND BY EMAIL] Retrieved User Hash:', user.password);
      console.log('[FIND BY EMAIL] Found user:', {
        id: user.id,
        email: user.email,
        passwordHash: user.password,
        passwordLength: user.password?.length,
        role: user.role?.name
      });
  
      return user;
    } catch (error) {
      console.error('[FIND BY EMAIL ERROR]', error);
      throw new InternalServerErrorException('Failed to fetch user by email');
    }
  }

  /**
   * Cập nhật thông tin người dùng
   * @param id ID người dùng
   * @param updateUserDto DTO chứa thông tin cập nhật
   * @returns Promise<User>
   * @throws NotFoundException nếu không tìm thấy user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      
      // Nếu có password trong DTO thì mã hóa
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.SALT_ROUNDS);
      }

      const updatedUser = this.userRepository.merge(user, updateUserDto);
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Xóa người dùng
   * @param id ID người dùng
   * @returns Promise<void>
   * @throws NotFoundException nếu không tìm thấy user
   */
  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      
      // Không cho phép xóa admin
      if (user.role.name === RoleEnum.ADMIN) {
        throw new BadRequestException('Cannot delete admin user');
      }

      await this.userRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async debugUserInfo(email: string): Promise<void> {
    try {
      const user = await this.findByEmail(email.trim().toLowerCase());
      if (!user) {
        console.log('[DEBUG] User not found');
        return;
      }
      
      console.log(`
        [USER DEBUG]
        Email: ${user.email}
        Stored Hash: ${user.password}
        Hash Length: ${user.password?.length}
        Created At: ${user.createdAt}
        Last Updated: ${user.updatedAt}
        Role: ${user.role?.name}
      `);
    } catch (error) {
      console.error('[DEBUG ERROR]', error);
    }
  }

  /**
   * Update user password
   */
  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }
}