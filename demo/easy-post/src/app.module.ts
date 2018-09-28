import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth/auth.service';
import { AuthStrategy } from './auth/auth.strategy';
import { ErrorsInterceptor } from './common/errors.interceptor';
import { PostController } from './controllers/post.controller';
import { UserController } from './controllers/user.controller';
import { Post } from './entities/post.entity';
import { User } from './entities/user.entity';
import { PostService } from './services/post.service';
import { UserService } from './services/user.service';
import { CryptoUtil } from './utils/crypto.util';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([User, Post]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600
            }
        })
    ],
    controllers: [
        UserController,
        PostController
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor
        },
        CryptoUtil,
        AuthService,
        AuthStrategy,
        UserService,
        PostService
    ]
})
export class AppModule { }