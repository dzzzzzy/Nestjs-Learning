# Nest 基础功能 —— Module

Nest 主要特性中的模块化开发，就源自与此。Nest 使用 `Module` 来组织应用程序结构，每个应用程序至少有一个模块，即根模块。根模块是 Nest 开始排列应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，尤其是当应用程序很小时。然而，对于大型应用来说，这是没有意义的。在大多数情况下，您将有很多模块，每个模块都有一组与其密切相关的功能。

## Module 有什么实际作用？

在上两节（`Controller` 和 `Provider`）中，我们学到了如何在 Nest 中定义并编写 **控制器** 和 **提供者**，本节，我们使用 `Module` 来组织这些 `Controller` 和 `Provider`，为他们在 **同模块范围内** 建立依赖的“桥梁”。

现在，让我们编写一个简单的模块，用来组织 `CatsController` 和 `CatsService`：

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

只有这样，Nest 才可以在 `CatsController` 中通过其构造函数，依赖注入 `CatsService`。

## 关于 @Module() 装饰器

`@Module()` 装饰器用来将一个类定义为 Nest 应用程序中的一个模块，在 `Controller` 中，我们了解到 Nest 中的几乎所有装饰器都是一个函数，`@Module()` 也不例外，他的参数可以传入一个对象，用来描述这个模块拥有哪些 **控制器** 和 **提供者**，并且告诉 Nest `IOC` 容器这个模块导入(`imports`)了哪些其他模块、导出(`exports`)了他自己的哪些提供者。

模块定义的完整示例：

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    imports: [],
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})
export class CatsModule { }
```

## 理解 Module 是如何管理依赖注入

在 Nest 中，一个模块对依赖注入有着至关重要的作用，在上述例子中，如果我们将 `providers` 数组中的 `CatsService` 去掉，在启动 Nest 程序时，他会告诉你类似如下的错误：

```none
[ExceptionHandler] Nest can't resolve dependencies of the CatsController (?). Please verify whether [0] argument is available in the current context.
```

这个错误的意思是说，Nest 不能处理 `CatsController` 中的依赖关系，即他无法自动的将 `CatsController` 构造器中的 **第1个** 依赖关系注入到 IOC 容器中。而且他还指明，请检查在当前上下文中，`CatsController` 构造器的 **第1个** 参数是否可见。

这里的当前上下文指的就是 `CatsModule`，因为 `CatsController` 要依赖 `CatsService` 来完成其功能，但是在当前上下文又找不到 `CatsService` 这个实例(对象)，所以 Nest 在启动的时候才会出现这种错误。

通俗的讲，如果要在 `controllers` 中的类使用当前模块的其他提供者(`Provider`)，那么就必须将其增加到当前模块的 `providers` 中去。

上述只是说明了在一个模块中，如何让 `Module` 去管理 `controllers` 和 `providers` 的依赖关系。但是，如果当前模块的 `Controller` 和 `Provider` 需要注入其他模块中的 `Provider` 呢？如果当前模块又需要给其他模块提供他的 `Provider` 呢？

这里就要用到 `@Module()` 装饰器中的 `imports` 和 `exports` 了，`imports` 告诉当前模块的 `Controller` 和 `Provider` 注入的非当前模块的 `Provider` 来自于哪个模块，而 `exports` 告诉当前模块要将他的哪些 `Provider` 提供给其他模块。

> 注意：如果要在当前模块使用其他模块的提供者，那么就必须在被导入的其他模块中，将该提供者放入 `exports` 数组中去。

让我们通过一个简单的例子来理解这个看似复杂的依赖关系：

```typescript
// 以下仅提供简化后的代码用于理解模块中的依赖注入

@Module({
    imports: [FishModule],
    controllers: [CatsController],
    providers: [CatsService],
    exports: []
})
export class CatsModule { }

@Module({
    imports: [],
    controllers: [FishController],
    providers: [FishService],
    exports: [FishService]
})
export class FishModule { }
```

在上述例子中，`CatsModule` 中的 `CatsService` 要使用 `FishModule` 中的 `FinshService`，只需要在 `CatsModule` 中导入 `FishModule` 并且在 `FishModule` 导出 `FishService` 即可。

> 注意：在当前模块 imports 中导入的模块，相当于将被导入模块的导出提供者注入到当前模块范围内的 IOC 容器中，以便当前模块的控制器和提供者在其构造器中依赖注入他。
>
> 在 Nest 中，默认情况下，模块是单例的，因此我们可以在不同模块间共用相同的实例。

### 模块的重导出

什么是模块的重导出？如果要将当前模块导入的模块分享给其他模块，那只需要将当前模块导入的模块放到其 `exports` 数组中即可。这种形式的导出，就叫模块的重导出。示例：

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule]
})
export class CoreModule {}
```

### 能否在一个被定义为模块的类中使用依赖注入？

答案是肯定的，很多情况下，比如出于配置的目的，我们需要在模块类中注入某些提供者并且使用他们的公共方法时，Nest 是允许在模块类中注入提供者的。这些提供者必须来自于当前模块范围内，也就是说，可以使用 `@Module()` 装饰器中 `providers` 所提供的任何提供者，也可以使用 `imports` 中导入的模块所导出的提供者。

但是！在一个模块类中，是不能导入一个出现循环依赖的提供者的。

> Tips: 本节暂不进行循环依赖的讲解

## 全局模块

如果你必须在很多地方都导入相同的模块，这会出现大量的冗余。但是 Nest 将提供者封装在模块范围内，如果不导入模块，就无法在其他地方使用他们导出的提供者。但是有时候，你可能只是想提供一组随时可用的提供者，例如：`helpers`、`database connection` 等等。针对这种特殊情况，Nest 提供了一个很强大的功能 —— **全局模块**，全局模块一旦被导入到根模块，在其他所有模块中即可轻松的使用这个全局模块导出的提供者，而且也不用在其他模块导入这个全局模块。

将一个模块定义为全局模块，只需要在类上额外增加一个装饰器 `@Global()` 即可，示例：

```typescript
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: []
})
export class CatsModule {}
```

> 注意：Nest 中只能定义一个全局模块！
>
> 将所有东西都放在全局模块内是一个不好的决定，全局模块只是用于减少必要的文件数量，`imports` 仍然是使模块 API 透明的最佳方式。

## 动态模块

Nest 模块系统具有一个称为动态模块的特性。他能够让我们创建可定制的模块，当导入模块并向其传入某些选项参数，这个模块根据这些选项参数来动态的创建不同特性的模块，这种通过导入时传入参数并动态创建模块的特性称为 **动态模块**。

下面以一个数据库模块来演示动态模块的使用：

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

默认情况下，该模块定义了 `Connection` 提供者，但是根据传递的 options(选项)和 entities(实体)，他还导出了提供者，例如存储库。事实上，动态模块扩展了基本模块元数据。当我们需要动态注册提供者时，这一重要功能非常有用。然后可以通过以下方式导入数据库模块：

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forRoot([User]),
  ],
})
export class ApplicationModule {}
```

如果需要将这个动态模块导出时，可以省略函数调用部分：

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forRoot([User]),
  ],
  exports: [DatabaseModule]
})
export class ApplicationModule {}
```

> 下一节：Nest 基础功能 —— [NestFactory](./nest-factory.md)
