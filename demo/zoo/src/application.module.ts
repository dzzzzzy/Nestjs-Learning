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
