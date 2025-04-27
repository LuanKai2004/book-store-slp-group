import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) cho việc đăng nhập
 */
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}