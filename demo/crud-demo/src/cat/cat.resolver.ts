import { Inject } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { Result } from '../common/result.interface';
import { Cat } from './cat.entity';
import { CatService } from './cat.service';

@Resolver()
export class CatResolver {
    constructor(
        @Inject(CatService) private readonly catService: CatService,
    ) { }

    /**
     * Query 和 Mutation 的方法签名默认是 (obj, args, context, info)
     *
     * obj：包含解析程序在父字段上返回的结果的对象，或者在顶级查询字段的情况下，包含从服务器配置传递的根值（rootValue）。一般情况下，定义为 req，即请求对象。
     * args：请求方法中的参数，是一个 JSON 对象，如 { nickname: "胖橘", species: "橘猫" }。一般情况下，定义为 body，即请求体
     * context：这是特定查询中所有解析器共享的对象，用于包含每个请求的状态，包括身份验证信息、数据加载器实例以及解析查询时应考虑的任何其他内容。一般情况下，不使用。
     * info：此参数仅应在高级情况下使用，但它包含有关查询执行状态的信息，包括字段名、从根到字段的路径等。一般情况下，不使用。
     *
     */

    @Mutation('createCat')
    async createCat(req, body: { cat: Cat }): Promise<Result> {
        await this.catService.createCat(body.cat);
        return { code: 200, message: '创建成功' };
    }

    @Mutation('deleteCat')
    async deleteCat(req, body: { id: number }): Promise<Result> {
        await this.catService.deleteCat(body.id);
        return { code: 200, message: '删除成功' };
    }

    @Mutation('updateCat')
    async updateCat(req, body: { id: number, cat: Cat }): Promise<Result> {
        const { id, cat } = body;
        await this.catService.updateCat(id, cat);
        return { code: 200, message: '更新成功' };
    }

    @Query('findOneCat')
    async findOneCat(req, body: { id: number }): Promise<Result> {
        const data = await this.catService.findOneCat(body.id);
        return { code: 200, message: '查询成功', data };
    }
}