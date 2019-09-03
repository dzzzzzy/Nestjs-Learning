import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AppService } from './app.service';

@Resolver('app')
export class AppResolver {
    constructor(
        @Inject(AppService) private readonly appService: AppService,
        @Inject('PubSub') private readonly pubSub: PubSub,
    ) { }

    @Query('sayHello')
    async sayHello(@Args() args: { name: string }) {
        return this.appService.sayHello(args.name);
    }

    @Mutation('pubMessage')
    async sayHi(@Args('msg') args: string) {
        this.pubSub.publish('subMessage', { subMessage: `msg: ${args}` });
        return `msg: ${args}`;
    }

    @Subscription('subMessage')
    subMessage() {
        return this.pubSub.asyncIterator('subMessage');
    }
}
