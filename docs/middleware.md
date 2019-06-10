# Nest 高级功能 —— Middleware

Middleware 即中间件，他是请求发出者和路由处理器之间的桥梁，可以透明的、轻松的访问请求和响应对象。在 Nest 中，中间件可以用多个，他们之间使用 `next()` 方法作为连接，连接后的所有中间件将在整个**请求-响应**周期内通过 `next()` 依次执行。

> 注：默认情况下，Nest 中间件等同于 `Express` 中间件。

以下是从 Express 官方文档中复制的中间件功能列表:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前中间件功能没有结束请求-响应周期，它必须调用 `next()` 将控制权传递给下一个中间件功能。否则，请求将被搁置。

## Nest 中间件预览

Nest 中间件可以是一个函数，也可以是一个带有 `@Injectable()` 装饰器的类，且该类应该实现 `NestMiddleware` 接口，而函数没有任何特殊要求。如下是一个日志中间件的简单示例：

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}
```

## 中间件中的依赖注入

谈到中间件，也不例外。与提供者（Provider）和控制器（Controller）一样，他能够通过构造函数注入属于同一模块的依赖项：

```typescript
import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class SomeMiddleware implements NestMiddleware {
  constructor(@Inject(SomeService) private readonly someService: SomeService) {}

  use(req: Request, res: Response, next: Function) {
    // do some logic...
    this.someService.method();

    console.log('Request...');
    next();
  }
}
```

## 如何使用中间件？

既然中间件是请求发出者和路由处理器之间的桥梁，那么他就应该在一个模块的入口，即 `XXXModule` 类中被使用。在 Nest 中，我们只需要在模块类中实现 `NestModule` 接口：

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

在上面的例子中，我们为 `/cats` 路由处理器（`@CatsController('/cats')`）设置了日志中间件。  
如果只需要给 `/cats` 路由中的某几个请求方法设置这个中间件，那只需要改变一下 `forRoutes()` 方法中的参数即可：`forRoutes({ path: 'cats', method: RequestMethod.GET })`，此时，只有 `GET` 请求才会被中间件拦截。

当应用程序越来越复杂时，路由也会随之增加，这个时候使用中间件，可能会存在很多 `forRoutes()` 的情况。基于此，Nest 提供了路由通配符的功能（与 `Controller` 中的路由通配符一样）。示例：

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL })
```

除此之外，`forRoutes()` 方法中还可以传入一个控制器类，如：`forRoutes(CatsController)`，他会将 `CatsController` 中的所有路由拦截并使用中间件。如果需要传入多个控制器类，只需要使用 `,` 分割，如： `forRoutes(CatsController, UserController)`。

不仅如此，`apply()` 方法同样可以传入一个或多个(用 `,` 分割)中间件，如：`apply(LoggerMiddleware, OtherMiddleware)`。这里可以同时传入类或函数中间件。

当你想排除一个控制器类中的某些路由不使用中间件时，使用 `exclude()` 方法即可，如：

```typescript
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
      )
      .forRoutes(CatsController);
  }
}
```

## 函数中间件

Nest 中的中间件可以是类，也可以是一个函数，上述都在讲关于类的中间件，这里使用函数来声明一个中间件：

```typescript
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
};
```

然后，在模块中使用即可：

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { logger } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .forRoutes(CatsController);
  }
}
```

## 全局中间件

为了将中间件一次绑定到每个注册的路由，我们可以使用 `INestApplication` 实例中的 `use()` 方法:

```typescript
const app = await NestFactory.create(ApplicationModule);
// 这里必须使用函数中间件
app.use(logger);
await app.listen(3000);
```
