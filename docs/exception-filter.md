# Nest 高级功能 —— Exception filter

Nest 内置异常层负责处理整个应用程序中抛出的所有异常。当捕获到未处理的异常时，用户最终将收到适当的友好响应。

每个出现的异常都由全局异常过滤器处理，当无法识别时(既不是HttpException，也不是从HttpException继承的类)，用户会收到以下JSON响应:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## 基础异常

在讲异常过滤器前，我们先熟悉框架的基础异常类：`HttpException`，`HttpException` 类来自于 `@nestjs/common`。正如你所想的，当程序抛出一个 `HttpException` 对象时，它会被异常处理程序捕获，然后转换成相关的 **JSON** 响应。

如何在控制器层抛出一个 `HttpException` 呢？

```typescript
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

此时，客户端会接收到如下 **JSON** 相应：

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

`HttpException` 类的构造器中第一个参数可以是 `string` 或 `object`，当你将异常改写成如下时：

```typescript
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, 403);
}
```

客户端会收到：

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```

这种通常用来做自定义的异常消息返回

## 异常等级/分类

在进行 web 开发时，通常会对异常进行等级或分类处理，nest 提供了开箱即用的常用异常类，在使用时，只需实例化相应的异常类：

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableEntityException
- InternalServerErrorException
- NotImplementedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException

如果上述异常类都无法满足我们的业务需求，此时，我们只需要继承 `HttpException` 类，来完成异常类的扩展：

```typescript
export class CustomException extends HttpException {
  constructor() {
    super('custom message', 409);
  }
}
```

## 异常过滤器

基础的异常处理程序满足了大多数异常需求，但是有时我们想完全控制异常处理程序，让其以我们期望的形式去工作。例如，增加一些日志，或是依据不同条件返回不同的 **JSON** 结构。此时，nest 的异常过滤器就是我们所期待的这种程序。当我们想改变 `HttpException` 的异常结构时，我们只需要实现 `ExceptionFilter` 接口：

```typescript
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();   // 获取请求上下文
    const response = ctx.getResponse(); // 在请求上下文中获取 response 对象
    const request = ctx.getRequest();   // 在请求上下文中获取 request 对象
    const status = exception.getStatus();   // 获取异常的状态码

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

在控制器的某个方法中使用上述定义的异常过滤器：

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

异常过滤器有如下几种级别：

- 控制器类级别：在 Controller 类上使用 @UseFilters(HttpExceptionFilter)
- 控制器方法级别：在 Controller 方法上使用 @UseFilters(HttpExceptionFilter)
- 全局级别

其中全局级别的异常过滤器有两种使用方法：

方法一：

```typescript
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

方法二：

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ApplicationModule {}
```

当定义的异常过滤器的构造函数中有依赖注入时，方法一不适用！

## 捕获所有异常

当你想使用异常过滤器捕获所有异常时，只需要将上文的 `@Catch(HttpException)` 装饰器改写为 `@Catch()` 即可