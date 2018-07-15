# 动物园里有什么？

动物园里有大西几！小凶许！小脑斧！梅发怒！小福泥！小海疼！发福蝶！大鸡居！大飞囊！大lai流！强颈怒！大蟒鞋！小白去！鸵寮！大带许！大穷猫！大诺坨！大你鱼！丹鼎货！小乌堆！你都记住了吗？

## 前言

nest 在国内的应用并不是很广泛，我也是从2018年5月中旬开始接触 nest 和其相关的技术栈。就我而言，nest 这个框架用来写大型应用很适合，因为他完美支持了 typescript，使得在开发期可以避免很多错误（typescript的类型推断机制），也让应用的后期持续集成和维护变得非常容易。对于熟悉 Java web 开发的同学而言，学习这个框架会非常的容易，因为他内部大量使用了DI、AOP的编程思想。我将通过搭积木的方式，来向大家提供一个非常简单的栗子，以便大家理解、掌握 nest 框架的基础知识。

## 先决条件

安装nodejs、typescript、MySQL数据库

## Step 1 准备自己喜欢的开发工具

这里我推荐使用 [Visual Studio Code(VS Code)](https://code.visualstudio.com)，插件推荐：

- npm
- TSLint
- Typescript Hero
- Code Runner
- .gitignore Generator
- Settings Sync
- TODO hignlight

备注：这些插件的作用，请大家自行查阅，安装自己喜欢的即可。

## Step 2 创建项目

创建一个名称为 zoo 的文件夹，使用 VS Code 打开，并按照栗子创建项目骨架和必要的文件

```bash
# 安装依赖
$ npm install
```

其中 `package-lock.json` 文件是安装依赖时自动生成的，不需要手动创建

```no-language
src
 |-- application.controller.ts  // 应用程序控制器
 |-- application.service.ts     // 应用程序业务逻辑
 |-- application.module.ts      // 应用程序根模块
 |-- server.ts                  // 应用程序入口文件
nodemon-debug.json  // nodemon `debug` 模式配置文件
nodemon.json        // nodemon 配置文件
package.json        // 定义了这个项目所需要的各种模块，以及项目的配置信息
package-lock.json   // 各种模块的版本锁文件，用于后续加速安装依赖
tsconfig.json       // 文件中指定了用来编译这个项目的根文件和编译选项
tslint.json         // ts 语法检查配置文件
```

## Step 3 创建 Hello Zoo

`application.controller.ts`

```typescript
import { Controller, Get, Inject } from "@nestjs/common";
import { ApplicationService } from "application.service";

/**
 * 应用程序控制器，@Controller() 可以指定参数，用于定义类的父路由，如 @Controller("cat")，此时这个类的所有父路由就会成为 /cat
 *
 * 被 @Controller() 修饰的类，可以通过其构造函数完成依赖注入，但依赖注入的类必须与当前类属于同一个模块
 */
@Controller()
export class ApplicationController {

    /**
     * 构造函数，用于注入这个类的依赖，注入类时，需要使用 @Inject() 修饰符，其参数是被注入的类的类名
     */
    constructor(
        @Inject(ApplicationService) private readonly applicationService: ApplicationService,
    ) { }

    /**
     * @Get() 可以指定参数，用于定义方法路由，如 @Get("cats")，此时这个方法路由就会成为 /父路由名/cats
     */
    @Get()
    async root() {
        return this.applicationService.root();
    }
}
```

`application.service.ts`

```typescript
import { Injectable } from "@nestjs/common";

/**
 * 被 @Injectable() 修饰的类，可以通过其构造函数完成依赖注入，但依赖注入的类必须与当前类属于同一个模块
 */
@Injectable()
export class ApplicationService {
    constructor() { } // 构造函数，一般用于处理依赖注入

    async root() {
        return "Hello Zoo";
    }
}
```

`application.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { ApplicationService } from "application.service";

import { ApplicationController } from "./application.controller";

/**
 * @Module() 定义一个模块，并管理这个模块的导入集合、控制器集合、提供者集合、导出集合
 */
@Module({
    imports: [],  // 导入其他模块的集合
    controllers: [ApplicationController],  // 当前模块的控制器集合
    providers: [ApplicationService],  // 当前模块的提供者集合
    exports: [], // 导出当前模块的提供者，用于被其他模块调用
})
export class ApplicationModule { }
```

`server.ts`

```typescript
import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "application.module";

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);  // 创建应用程序实例
    await app.listen(3000);  // 使用3000端口监听应用程序
}

bootstrap();  // 启动应用程序 -> localhost:3000
```

启动应用程序 `$ npm run start`，打开浏览器输入 `localhost:3000`！
