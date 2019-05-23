import { Controller, Get, Req, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  @Get('token')
  async createToken(@Req() request: Request) {
    // 判断参数是否填写
    if (!(request.headers.account && request.headers.password)) {
      throw new BadRequestException('请在请求头添加 account 和 password 参数', '认证参数未填写');
    }
    // 获取请求头的 account 和 password
    const account = String(request.headers.account);
    const password = String(request.headers.password);
    // 判断用户是否存在
    if (!await this.usersService.hasUser(account)) {
      throw new BadRequestException('请先尝试注册用户', '用户不存在');
    }
    // 判断用户密码是否正确
    if (!await this.usersService.isPasswordCorrect(account, password)) {
      throw new BadRequestException('请重新输入密码', '密码错误');
    }
    // 签发 Token
    const token = await this.authService.signIn(account);
    return { token };
  }
}
