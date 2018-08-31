import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
    constructor(
        @Inject(AppService) private readonly appService: AppService
    ) { }

    @Query('sayHello')
    async sayHello(_, { name }, context) {
        // 在 context 中可以获取 req 对象
        // console.log(context.req);

        return this.appService.sayHello(name);
    }
}