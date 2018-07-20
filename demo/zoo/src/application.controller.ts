import { Controller, Get, Inject } from "@nestjs/common";

import { ApplicationService } from "./application.service";

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
