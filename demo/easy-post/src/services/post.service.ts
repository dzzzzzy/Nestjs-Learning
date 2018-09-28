import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepo: Repository<Post>
    ) { }

    async findAll(): Promise<Post[]> {
        return await this.postRepo.find();
    }
}