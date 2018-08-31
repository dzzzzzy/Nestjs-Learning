import { Inject, Module } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { ApolloServer } from 'apollo-server-express';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
    imports: [GraphQLModule],
    providers: [AppResolver, AppService]
})
export class AppModule {
    constructor(
        @Inject(GraphQLFactory) private readonly graphQLFactory: GraphQLFactory
    ) { }

    configureGraphQL(app: any) {
        const typeDefs = this.graphQLFactory.mergeTypesByPaths('**/*.types.graphql');
        const schema = this.graphQLFactory.createSchema({ typeDefs });

        /**
         * context: apollo server 上下文配置，可以在参数中使用 { req, res }，获取上下文的请求、响应对象，并将其传入到上下文中
         *
         * 在每个 resolver 的方法中的第三个参数，可以获取当前 apollo server 上下文 (_, _, context)
         *
         * playground: apollo server 提供的 IDE，这里添加了 IDE 的主题和光标配置
         */
        const apolloServer = new ApolloServer({
            schema,
            context: ({ req }) => {
                return { req };
            },
            playground: {
                settings: {
                    'editor.theme': 'light',
                    'editor.cursorShape': 'line'
                }
            }
        });

        // 在 apollo server 中使用当前 app 对象作为其中间件
        apolloServer.applyMiddleware({ app });
    }
}