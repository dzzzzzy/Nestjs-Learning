import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("animal")
export class Animal {
    /**
     * 自增主键
     */
    @PrimaryGeneratedColumn({
        comment: "自增ID"
    })
    id: number;

    /**
     * 唯一约束的动物名称字段
     */
    @Column({
        comment: "动物名称",
        unique: true
    })
    name: string;

    /**
     * 唯一约束的动物名称字段
     */
    @Column({
        comment: "动物别名",
        unique: true
    })
    alias: string;
}
