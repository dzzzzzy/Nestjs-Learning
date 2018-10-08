import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { Result } from '../common/result.interface';
import { Roles } from '../decorators/roles.decorator';
import { Post as UserPost } from '../entities/post.entity';
import { RolesGuard } from '../guards/roles.guard';
import { PostService } from '../services/post.service';

@Controller('post')
export class PostController {
    constructor(
        @Inject(PostService) private readonly postService: PostService
    ) { }

    @Post()
    async createPost(@Body() createInput: UserPost): Promise<Result> {
        await this.postService.create(createInput);
        return { code: 200, message: '创建帖子成功' };
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async remove(@Param() id: number): Promise<Result> {
        await this.postService.remove(id);
        return { code: 200, message: '删除帖子成功' };
    }

    @Put(':id')
    @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async update(@Param() id: number, @Body() updateInput: UserPost): Promise<Result> {
        await this.postService.update(id, updateInput);
        return { code: 200, message: '更新帖子成功' };
    }

    @Get()
    async findAll(@Req() req: Request): Promise<Result> {
        const data = await this.postService.findAll(req.user.id);
        return { code: 200, message: '查询所有帖子成功', data };
    }

    @Get(':id')
    async findOne(@Param() id: number): Promise<Result> {
        const data = await this.postService.findOneById(id);
        return { code: 200, message: '查询帖子成功', data };
    }
}