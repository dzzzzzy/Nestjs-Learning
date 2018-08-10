import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat')
export class Cat {
    /**
     * 自增主键
     */
    @PrimaryGeneratedColumn({
        comment: '猫猫的自增ID'
    })
    id: number;

    /**
     * 猫猫昵称
     */
    @Column({
        comment: '猫猫昵称'
    })
    nickname: string;

    /**
     * 猫猫品种
     */
    @Column({
        comment: '猫猫品种'
    })
    species: string;
}