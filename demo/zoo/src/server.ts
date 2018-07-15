import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "application.module";

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);  // 创建应用程序实例
    await app.listen(3000);  // 使用3000端口监听应用程序
}

bootstrap();  // 启动应用程序 -> localhost:3000
