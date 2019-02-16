import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
    imports: [
        // 向帖子模块注册 passport，并配置默认策略为 jwt，因为覆盖了默认的策略，所以要在每个使用 @AuthGuard() 的模块导入 PassportModule
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([Post])
    ],
    providers: [PostService],
    controllers: [PostController]
})
export class PostModule { }