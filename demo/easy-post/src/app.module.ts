import { Module } from '@nestjs/common';

import { PostController } from './controllers/post.controller';
import { UserController } from './controllers/user.controller';
import { PostService } from './services/post.service';
import { UserService } from './services/user.service';

@Module({
    controllers: [UserController, PostController],
    providers: [UserService, PostService]
})
export class AppModule { }