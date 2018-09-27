# Nest 基础功能 —— NestFactory

在前面的学习中，我们构建了 `CatsController` 和 `CatsService`，现在让我们用一个应用程序根 `Module` 来管理这两个实例：

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class AppModule { }
```

有了应用程序根模块，我们就可以使用 `NestFactory` 来创建一个 Nest 应用了，下面先来看一个简单的例子：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 声明一个异步的引导程序函数
async function bootstrap() {
  // 使用 NestFactory 创建一个根模块为 AppModule 的 Nest app
  const app = await NestFactory.create(AppModule);
  // 将这个 Nest app 监听本地的 3000 端口，即：http://localhost:3000
  await app.listen(3000);
}

// 调用引导程序
bootstrap();
```

通过上述代码，结合 `Controller` 和 `Provider` 这两小节，我们就可以很轻松的创建一个服务端的 Nest 应用了。

## 通过源码深入理解 NestFactory

> 源码地址：[nest-factory.ts](https://github.com/nestjs/nest/blob/master/packages/core/nest-factory.ts)

`NestFactory` 是一个被 `new` 创建的 `NestFactoryStatic` 对象，而 `NestFactoryStatic` 对象里的方法正是上文创建 Nest 应用所调用的。

下面我们列举 `NestFactory` 对象的 `create` 方法列表：

```typescript
public async create(module: any, options?: NestApplicationOptions): Promise<INestApplication & INestExpressApplication>;

public async create(module: any, httpServer: FastifyAdapter, options?: NestApplicationOptions): Promise<INestApplication & INestFastifyApplication>;

public async create(module: any, httpServer: HttpServer | any, options?: NestApplicationOptions): Promise<INestApplication & INestExpressApplication>;

public async create(module: any, serverOrOptions?: any, options?: NestApplicationOptions): Promise<INestApplication & (INestExpressApplication | INestFastifyApplication)> {
    const isHttpServer = serverOrOptions && serverOrOptions.patch;

    let [httpServer, appOptions] = isHttpServer
      ? [serverOrOptions, options]
      : [ExpressFactory.create(), serverOrOptions];

    const applicationConfig = new ApplicationConfig();
    const container = new NestContainer(applicationConfig);
    httpServer = this.applyExpressAdapter(httpServer);

    this.applyLogger(appOptions);
    await this.initialize(module, container, applicationConfig, httpServer);
    return this.createNestInstance<NestApplication>(
      new NestApplication(container, httpServer, applicationConfig, appOptions),
    );
}
```

通过 `Typescript` 的函数重载特性，`Nest` 会依据 `create` 方法中传入参数的不同而创建不同类型的 **NestApplication**。比如，默认创建 `NestExpressApplication`，即使用 `express` 作为 web 层的框架，而当在 `create` 方法的第二个参数传入 `new FastifyAdapter()` 时，会创建 `NestFastifyApplication`，这样 web 层就会替换为 `fastify`。

> 还有两个公开的方法，`createMicroservice` 和 `createApplicationContext`，当要创建微服务的 **server** 时使用 `createMicroservice`，当要创建 **应用程序上下文** 时，使用 `createApplicationContext`