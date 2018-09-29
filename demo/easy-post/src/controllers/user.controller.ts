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

    /**
     * 用户登录成功后，返回的 data 是授权令牌；
     * 在调用有 @UseGuards(AuthGuard()) 注解的路由时，会检查当前请求头中是否包含 Authorization: Bearer xxx 授权令牌，
     * 其中 Authorization 是用于告诉服务端本次请求有令牌，并且令牌前缀是 Bearer，而令牌的具体内容是登录之后返回的 data(accessToken)。
     */
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