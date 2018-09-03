import { Injectable } from '@nestjs/common';

/**
 * 被 @Injectable() 修饰的类，可以通过其构造函数完成依赖注入，但依赖注入的类必须与当前类属于同一个模块
 */
@Injectable()
export class AppService {
    constructor() { } // 构造函数，一般用于处理依赖注入

    async root() {
        return 'Hello World!';
    }
}