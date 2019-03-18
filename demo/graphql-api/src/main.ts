import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(3000, '0.0.0.0', () => {
        Logger.log('GraphQL api server started on: http://localhost:3000/graphql');
    });
}

bootstrap();