import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepo: Repository<Post>
    ) { }

    async create(post: Post): Promise<void> {
        await this.postRepo.save(post);
    }

    async remove(id: number): Promise<void> {
        const existing = await this.findOneById(id);
        if (!existing) throw new HttpException(`删除失败，ID 为 '${id}' 的帖子不存在`, 404);
    }

    async update(id: number, title?: string, content?: string): Promise<void> {
        const existing = await this.findOneById(id);
        if (!existing) throw new HttpException(`更新失败，ID 为 '${id}' 的帖子不存在`, 404);
        if (title) existing.title = title ? title : existing.title;
        if (content) existing.content = content ? content : existing.content;
    }

    async findOneById(id: number): Promise<Post> {
        return await this.postRepo.findOne(id);
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepo.find();
    }
}