import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorsInterceptor } from './core/interceptors/errors.interceptor';
import { PostModule } from './feature/post/post.module';
import { UserModule } from './feature/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),    //  建立 typeorm 与数据库的连接
        UserModule,
        PostModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,   // 全局拦截器，这里使用全局异常拦截器改写异常消息结构
            useClass: ErrorsInterceptor
        }
    ]
})
export class AppModule { }