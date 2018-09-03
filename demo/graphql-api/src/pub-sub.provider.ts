import { PubSub } from 'graphql-subscriptions';

export const PubSubFactory = {
    provide: 'PubSub',
    useFactory: () => {
        return new PubSub();
    }
};