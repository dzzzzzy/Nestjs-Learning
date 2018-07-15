import { Module } from "@nestjs/common";
import { ApplicationService } from "application.service";

import { ApplicationController } from "./application.controller";

@Module({
    imports: [],  // 导入其他模块
    controllers: [ApplicationController],  // 应用程序的所有控制器
    providers: [ApplicationService],  // 应用程序的所有提供者
    exports: [], // 可用于导出提供者或模块
})
export class ApplicationModule { }
