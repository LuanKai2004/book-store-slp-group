import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { Public } from '../shared/decorators/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService, 
  ) {}
  
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Đăng ký thành công' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dữ liệu không hợp lệ' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Email đã tồn tại' 
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đăng ký thành công',
      data: result
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Đăng nhập thành công' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Email hoặc mật khẩu không đúng' 
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authService.login(loginUserDto); // Pass the DTO object directly
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data: result
    };
  }

  @Public()
  @Post('debug/hash-test')
  @ApiOperation({ summary: 'Debug hash test' })
  async manualHashTest(@Body() body: { password: string }) {
    await this.authService.manualHashTest(body.password);
    return { status: 'Check server logs for results' };
  }

  @Public()
  @Get('debug/user-info/:email')
  @ApiOperation({ summary: 'Debug user info' })
  async debugUserInfo(@Param('email') email: string) {
    await this.userService.debugUserInfo(email);
    return { status: 'Check server logs for results' };
  }

  @Public()
  @Put('debug/reset-password')
  @ApiOperation({ summary: 'Reset user password (Debug only)' })
  async resetPassword(@Body() body: { email: string, password: string }) {
    const result = await this.authService.resetPassword(body.email, body.password);
    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
      data: result
    };
  }
}