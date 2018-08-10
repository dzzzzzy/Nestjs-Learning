import { FastifyAdapter, NestFactory } from '@nestjs/core';
import { GraphQLFactory } from '@nestjs/graphql';
import * as bodyParser from 'body-parser';
import { fastifyGraphiQL, fastifyGraphQL } from 'fastify-graphql-middleware';

import { AppModule } from './app.module';
import { graphqlConfig } from './configuration';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());  // 创建应用程序实例，此时所有被 AppModule 导入的其他模块的所有实例都会被加载

    // 配置文件中如果启用了 IDE，则向 fastify 注册这个 IDE 插件
    if (graphqlConfig.ide.enable) {
        app.use(graphqlConfig.ide.prefix, fastifyGraphiQL({ endpointURL: graphqlConfig.ide.endpointURL }));
    }

    // 配置 bodyParser 中间件
    app.use('/graphql', bodyParser.json());

    // 获取上下文中的 GraphQLFactory，然后解析 graphql 文件，并创建 graphql schema
    const graphQLFactory = app.get(GraphQLFactory);
    const typeDefs = graphQLFactory.mergeTypesByPaths(graphqlConfig.typeDefsPath);
    const schema = graphQLFactory.createSchema({ typeDefs });
    app.use('/graphql', fastifyGraphQL(req => ({ schema, rootValue: req })));

    await app.listen(3000);  // 使用3000端口监听应用程序
}

bootstrap();  // 启动应用程序 -> localhost:3000