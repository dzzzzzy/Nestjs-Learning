import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../../feature/user/user.module';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

@Module({
    imports: [
        JwtModule.register({    // 向 nest 容器注册 jwt 模块，并配置密钥和令牌有效期
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600
            }
        }),
        forwardRef(() => UserModule)    // 处理模块间的循环依赖
    ],
    providers: [AuthService, AuthStrategy],
    exports: [AuthService]  // 导出 AuthServie 供 UserModule 使用
})
export class AuthModule { }