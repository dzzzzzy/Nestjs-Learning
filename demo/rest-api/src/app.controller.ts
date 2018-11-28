import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from './app.service';

/**
 * 应用程序控制器，@Controller() 可以指定参数，用于定义类的父路由，如 @Controller("cat")，此时这个类的所有父路由就会成为 /cat
 *
 * 被 @Controller() 修饰的类，可以通过其构造函数完成依赖注入，但依赖注入的类必须与当前类属于同一个模块
 */
@Controller()
export class AppController {

    /**
     * 构造函数，用于注入这个类的依赖，注入类时，需要使用 @Inject() 修饰符，其参数是被注入的类的类名
     *
     * 在注入被 @Injectable() 修饰的类时，可以不使用 @Inject() 修饰参数，此时依赖注器入会使用参数的类型完成注入
     *
     * Tips: 这里我使用 @Inject(AppService) 是为了规范代码风格
     */
    constructor(
        @Inject(AppService) private readonly appService: AppService,
    ) { }

    /**
     * @Get() 可以指定参数，用于定义方法路由，如 @Get(":id")，此时这个方法路由就会成为 /cat/:id，即查询指定ID的 Cat
     */
    @Get()
    async root() {
        return this.appService.root();
    }
}