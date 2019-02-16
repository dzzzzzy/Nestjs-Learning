import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from '../post/post.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @Column({
        default: 'regular'
    })
    role: string;
}