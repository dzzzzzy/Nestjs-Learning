import { createConnection } from 'typeorm';

import { Post } from './post.entity';
import { User } from './user.entity';

createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'postgres',
    entities: [__dirname + '/*.entity.ts'],
    maxQueryExecutionTime: 1000,
    synchronize: true,
    dropSchema: true,
    // logging: true,
    // logger: 'advanced-console'
}).then(async connection => {
    const userRepo = connection.getRepository(User);
    const postRepo = connection.getRepository(Post);

    for (let userIndex = 0; userIndex < 10; userIndex++) {
        await userRepo.save(userRepo.create({
            name: `user_${userIndex + 1}`,
            posts:
                [
                    postRepo.create({ title: `user_${userIndex + 1}_title_1` }),
                    postRepo.create({ title: `user_${userIndex + 1}_title_2` })
                ]
        }));
    }
    // getManyAndCount 返回一个长度为2的元组，[0] 是分页后的数据数组， [1] 是所有数据总数
    const userInfoWithOL = await userRepo.createQueryBuilder('user').leftJoinAndSelect('user.posts', 'post').offset(3).limit(5).getManyAndCount();

    const userInfoWithST = await userRepo.createQueryBuilder('user').leftJoinAndSelect('user.posts', 'post').skip(3).take(5).getManyAndCount();

    const userInfoTableWithOL = userInfoWithOL[0].map(item => {
        return {
            id: item.id,
            name: item.name,
            posts: JSON.stringify(item.posts.sort((current, next) => current.id - next.id))
        };
    });

    const userInfoTableWithST = userInfoWithST[0].map(item => {
        return {
            id: item.id,
            name: item.name,
            posts: JSON.stringify(item.posts.sort((current, next) => current.id - next.id))
        };
    });

    console.table(userInfoTableWithOL);

    console.table(userInfoTableWithST);

    connection.close();
});