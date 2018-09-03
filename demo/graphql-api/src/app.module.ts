import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { PubSubFactory } from './pub-sub.provider';

@Module({
    imports: [
        GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            installSubscriptionHandlers: true,
            playground: {
                settings: {
                    'editor.theme': 'light',
                    'editor.cursorShape': 'line'
                }
            }
        })
    ],
    providers: [
        PubSubFactory,
        AppResolver, AppService
    ]
})
export class AppModule { }