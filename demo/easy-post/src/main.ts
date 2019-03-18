import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.listen(5000).then(() => {
        new Logger('EasyPost').log('EasyPost API server has been started on http://localhost:5000');
    });
}

bootstrap();