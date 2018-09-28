import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Post } from '../entities/post.entity';
import { PostService } from '../services/post.service';

@Controller('post')
export class PostController {
    constructor(
        @Inject(PostService) private readonly postService: PostService
    ) { }

    @UseGuards(AuthGuard())
    @Get()
    async findAll(): Promise<Post[]> {
        return await this.postService.findAll();
    }
}