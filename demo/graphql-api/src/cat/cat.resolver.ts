import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Result } from '../common/result.interface';
import { Cat } from './cat.entity';
import { CatService } from './cat.service';

@Resolver('Cat')
export class CatResolver {
    constructor(
        @Inject(CatService) private readonly catService: CatService,
    ) { }

    @Mutation('createCat')
    async createCat(@Args('cat') cat: Cat): Promise<Result> {
        await this.catService.createCat(cat);
        return { code: 200, message: '创建成功' };
    }

    @Mutation('deleteCat')
    async deleteCat(@Args('id') id: number): Promise<Result> {
        await this.catService.deleteCat(id);
        return { code: 200, message: '删除成功' };
    }

    @Mutation('updateCat')
    async updateCat(@Args() updateInput: { id: number, cat: Cat }): Promise<Result> {
        await this.catService.updateCat(updateInput.id, updateInput.cat);
        return { code: 200, message: '更新成功' };
    }

    @Query('findOneCat')
    async findOneCat(@Args('id') id: number): Promise<Result> {
        const data = await this.catService.findOneCat(id);
        return { code: 200, message: '查询成功', data };
    }

    @Query('findCats')
    async findCats(): Promise<Result> {
        const data = await this.catService.findCats();
        return { code: 200, message: '查询成功', data };
    }
}