import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) cho việc tạo mới người dùng
 */
export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  @MaxLength(100, { message: 'Họ tên tối đa 100 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(100, { message: 'Email tối đa 100 ký tự' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(30, { message: 'Mật khẩu không được vượt quá 30 ký tự' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,13}$/, {
    message:
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
  })
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}