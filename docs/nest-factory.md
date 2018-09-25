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

## TODO: 通过源码深入讲解 NestFactory