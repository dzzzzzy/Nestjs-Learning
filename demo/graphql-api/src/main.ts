import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(2333, '0.0.0.0', () => {
        Logger.log('GraphQL IDE started on: http://localhost:2333/graphql');
    });
}

bootstrap();