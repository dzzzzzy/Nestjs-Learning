import { Body, Controller, Inject, Post } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { Result } from '../common/result.interface';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @Inject(UserService) private readonly userService: UserService
    ) { }

    @Post('login')
    async login(@Body() body: { account: string, password: string }): Promise<Result> {
        await this.userService.login(body.account, body.password);
        const accessToken = await this.authService.createToken({ account: body.account });
        return { code: 200, message: '登录成功', data: accessToken };
    }

    @Post('register')
    async register(@Body() user: User): Promise<Result> {
        await this.userService.register(user);
        return { code: 200, message: '注册成功' };
    }
}