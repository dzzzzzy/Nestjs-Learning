import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { ErrorsInterceptor } from './common/errors.interceptor';
import { PubSubFactory } from './pub-sub.provider';

@Module({
    imports: [
        GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            installSubscriptionHandlers: true
        }),
        TypeOrmModule.forRoot(),
        CatModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor
        },
        PubSubFactory,
        AppResolver, AppService
    ]
})
export class AppModule { }
