import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto'; // Import the DTO
import { UserService } from '../user/user.service';
import { JwtPayload } from './guards/JwtPayload.interface';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng ký tài khoản mới
   */
  async register(createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    try {
      console.log('[REGISTER] Incoming createUserDto:', createUserDto);

      // Normalize the password before hashing
      const normalizedPassword = createUserDto.password.trim().normalize('NFKC');
      console.log('[REGISTER] Normalized Password:', normalizedPassword);

      const user = await this.userService.create(createUserDto);
      console.log('[REGISTER] User created successfully:', user);

      return this.generateToken(user);
    } catch (error) {
      console.error('[REGISTER ERROR]', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }
  
  /**
   * Xác thực người dùng
   */
  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const normalizedPassword = pass.trim().normalize('NFKC'); // Ensure consistent normalization
  
      console.log('[LOGIN] Raw Password:', JSON.stringify(pass));
      console.log('[LOGIN] Trimmed Password:', JSON.stringify(normalizedPassword));
      console.log('[LOGIN] Normalized Password:', JSON.stringify(normalizedPassword));
      console.log('[LOGIN] Password Length:', normalizedPassword.length);
  
      if (!normalizedPassword || normalizedPassword.length < 6) {
        console.log('[LOGIN] Invalid password format');
        return null;
      }
  
      console.log('[LOGIN] Searching for user with email:', trimmedEmail);
      const user = await this.userService.findByEmail(trimmedEmail);
      if (!user) {
        console.log('[LOGIN] User not found');
        return null;
      }
  
      console.log('[LOGIN] Found user:', user);
      console.log('[LOGIN] Stored Hash:', user.password);
      console.log('[LOGIN] Hash Length:', user.password.length);
      console.log('[DEBUG] Retrieved Hash from Database:', user.password);
      console.log('[DEBUG] Hash Length from Database:', user.password?.length);
  
      if (!user.password) {
        console.error('[LOGIN] No password set for user');
        return null;
      }
  
      console.log('[LOGIN] Raw Password Input:', pass);

      // Manual rehash and compare for debugging
      const rehashedPassword = await bcrypt.hash(normalizedPassword, this.SALT_ROUNDS);
      console.log('[DEBUG] Rehashed Password for Manual Compare:', rehashedPassword);

      const manualCompare = rehashedPassword === user.password;
      console.log('[DEBUG] Manual Rehash Compare Result:', manualCompare);

      // Extract salt from the stored hash for debugging
      const storedSalt = user.password.substring(0, 29); // Extract the first 29 characters (bcrypt salt)
      console.log('[DEBUG] Extracted Salt:', storedSalt);

      const rehashedWithStoredSalt = await bcrypt.hash(normalizedPassword, storedSalt);
      console.log('[DEBUG] Rehashed Password with Stored Salt:', rehashedWithStoredSalt);

      const isMatchWithStoredSalt = rehashedWithStoredSalt === user.password;
      console.log('[DEBUG] Match with Stored Salt Result:', isMatchWithStoredSalt);

      const isMatch = await bcrypt.compare(normalizedPassword, user.password);
      console.log('[LOGIN] Bcrypt Compare Result:', isMatch);
  
      if (!isMatch) {
        console.error('[LOGIN] Password mismatch');
        console.log('[DEBUG] Normalized Password:', normalizedPassword);
        console.log('[DEBUG] Stored Hash:', user.password);
        return null;
      }
  
      const fullUser = await this.userService.findOne(user.id);
      const { password, ...result } = fullUser;
      console.log('[LOGIN] User authenticated successfully:', result);
  
      return result;
    } catch (error) {
      console.error('[VALIDATION ERROR]', error);
      throw new InternalServerErrorException('Failed to validate user');
    }
  }
  
  /**
   * Đăng nhập hệ thống
   */
  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    try {
      console.log('[LOGIN] Incoming login request:', loginUserDto);
  
      const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
  
      if (!user) {
        console.log('[LOGIN] Invalid email or password');
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }
  
      console.log('[LOGIN] User validated successfully:', user);
  
      return this.generateToken(user);
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to login');
    }
  }
  
  
  /**
   * Tạo JWT token
   */
  private generateToken(user: any): { access_token: string } {
    const payload: JwtPayload = { 
      email: user.email, 
      sub: user.id,
      role: user.role.name 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async manualHashTest(password: string): Promise<void> {
    try {
      console.log('[HASH TEST] Raw Password:', password);
      const normalizedPassword = password.trim().normalize('NFKC');
      console.log('[HASH TEST] Normalized Password:', normalizedPassword);

      const hash = await bcrypt.hash(normalizedPassword, 10);
      console.log('[HASH TEST] Generated Hash:', hash);

      const isMatch = await bcrypt.compare(normalizedPassword, hash);
      console.log('[HASH TEST] Bcrypt Compare Result:', isMatch);
    } catch (error) {
      console.error('[HASH TEST ERROR]', error);
    }
  }

  /**
   * Reset user password (Debug purpose only)
   */
  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      console.log('[PASSWORD RESET] Attempting to reset password for:', email);
      
      // Find the user
      const user = await this.userService.findByEmail(email);
      if (!user) {
        console.log('[PASSWORD RESET] User not found');
        throw new NotFoundException('User not found');
      }
      
      // Hash the new password
      console.log('[PASSWORD RESET] Hashing new password...');
      const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
      console.log('[PASSWORD RESET] New hash generated:', hashedPassword);
      
      // Update user with new password
      await this.userService.updatePassword(user.id, hashedPassword);
      console.log('[PASSWORD RESET] Password updated successfully');
      
      // Test the new password
      const isValid = await bcrypt.compare(newPassword, hashedPassword);
      console.log('[PASSWORD RESET] Verification test:', isValid ? 'PASSED' : 'FAILED');
      
      return { success: true };
    } catch (error) {
      console.error('[PASSWORD RESET ERROR]', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}