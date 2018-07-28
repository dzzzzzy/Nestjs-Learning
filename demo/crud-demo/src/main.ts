import { FastifyAdapter, NestFactory } from '@nestjs/core';
import { GraphQLFactory } from '@nestjs/graphql';
import { graphiqlFastify, graphqlFastify } from 'fastify-graphql';

import { AppModule } from './app.module';
import { graphqlConfig } from './configurations';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());  // 创建应用程序实例，此时所有被 AppModule 导入的其他模块的所有实例都会被加载
    const graphQLFactory = app.get(GraphQLFactory);
    const typeDefs = graphQLFactory.mergeTypesByPaths(graphqlConfig.typeDefsPath);
    const schema = graphQLFactory.createSchema({ typeDefs });
    app.register(graphqlFastify, {
        prefix: graphqlConfig.prefix,
        graphql: {
            schema
        }
    });
    // 配置文件中如果启用了 IDE，则向 fastify 注册这个 IDE 插件
    if (graphqlConfig.ide.enable) {
        app.register(graphiqlFastify, {
            prefix: graphqlConfig.ide.prefix,
            graphiql: {
                endpointURL: graphqlConfig.ide.endpoint
            }
        });
    }

    await app.listen(3000);  // 使用3000端口监听应用程序
}

bootstrap();  // 启动应用程序 -> localhost:3000