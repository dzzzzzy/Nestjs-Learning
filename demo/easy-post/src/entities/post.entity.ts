import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity('post')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'text'
    })
    content: string;

    @ManyToOne(type => User, user => user.posts)
    user: User;
}