import { Injectable } from "@nestjs/common";

@Injectable()
export class ApplicationService {
    constructor() { } // 构造函数，一般用于处理依赖注入

    async root() {
        return "Hello World";
    }
}
