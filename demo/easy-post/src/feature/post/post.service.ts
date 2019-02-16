import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepo: Repository<Post>
    ) { }

    /**
     * 创建帖子
     *
     * @param createInput createInput
     */
    async create(createInput: Post): Promise<void> {
        await this.postRepo.save(createInput);
    }

    /**
     * 删除帖子
     *
     * @param id 帖子ID
     */
    async remove(id: number): Promise<void> {
        const existing = await this.findOneById(id);
        if (!existing) throw new HttpException(`删除失败，ID 为 '${id}' 的帖子不存在`, 404);
        await this.postRepo.remove(existing);
    }

    /**
     * 更新帖子
     *
     * @param id 帖子ID
     * @param updateInput updateInput
     */
    async update(id: number, updateInput: Post): Promise<void> {
        const existing = await this.findOneById(id);
        if (!existing) throw new HttpException(`更新失败，ID 为 '${id}' 的帖子不存在`, 404);
        if (updateInput.title) existing.title = updateInput.title;
        if (updateInput.content) existing.content = updateInput.content;
        await this.postRepo.save(existing);
    }

    /**
     * 查询帖子
     *
     * @param id 帖子ID
     */
    async findOneById(id: number): Promise<Post> {
        return await this.postRepo.findOne(id);
    }

    /**
     * 查询用户的所有帖子
     *
     * @param userId 用户ID
     */
    async findAll(userId: number): Promise<Post[]> {
        return await this.postRepo.find({ where: { user: { id: userId } } });
    }
}