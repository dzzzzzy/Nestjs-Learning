import { Controller, Post, Body, ConflictException, forwardRef, Inject, HttpCode } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { MongoError } from 'mongodb';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }

  @Post()
  @HttpCode(200)
  async createUser(@Body() createUserDto: CreateUserDto) {
    // 创建一个新用户
    await this.userService.create(createUserDto)
      .catch((reason: MongoError) => {
        if (reason.code === 11000) {
          throw new ConflictException('请使用该存在的账号', '用户已经存在');
        }
      });
    // 签发 Token
    const token = await this.authService.signIn(createUserDto.account);
    return { token };
  }
}
