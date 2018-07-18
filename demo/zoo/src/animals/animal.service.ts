import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Animal } from "./animal.entity";

@Injectable()
export class AnimalService {
    constructor(
        @InjectRepository(Animal) private readonly animalRepo: Repository<Animal>,  // 使用泛型注入对应类型的存储库实例
    ) { }

    /**
     * 创建动物
     *
     * @param animal 动物实体对象
     */
    async createAnimal(animal: Animal): Promise<Animal> {
        /**
         * 创建新的实体实例，并将此对象的所有实体属性复制到新实体中。 请注意，它仅复制实体模型中存在的属性。
         */
        // this.animalRepo.create(animal);

        /**
         * 先根据 name huo alias 查询一个记录，如果存在则不进行插入
         *
         * 如果不存在，则将给定实体保存在数据库中
         */
        const exist = await this.animalRepo.createQueryBuilder("animal").where("animal.name = :name", { name: animal.name }).orWhere("animal.alias = :alias", { alias: animal.alias }).getOne();
        if (exist) {
            throw new HttpException("该动物已被创建", 409);
        }
        // 插入数据时，删除 id，以避免请求体内传入 id
        delete animal.id;
        return this.animalRepo.save(animal);

        /**
         * 将给定实体插入数据库。与save方法不同，执行原始操作时不包括级联，关系和其他操作。
         * 执行快速有效的INSERT操作。不检查数据库中是否存在实体，因此如果插入重复实体，本次操作将失败。
         */
        // await this.animalRepo.insert(animal);
    }

    /**
     * 删除动物
     *
     * @param id 动物ID
     */
    async deleteAnimal(id: number): Promise<void> {
        await this.findOneById(id);
        this.animalRepo.delete(id);
    }

    /**
     * 更新动物
     *
     * @param animal 动物实体对象
     */
    async updateAnimal(id: number, animal: Animal): Promise<void> {
        await this.findOneById(id);
        // 更新数据时，删除 id，以避免请求体内传入 id
        delete animal.id;
        this.animalRepo.update(id, animal);
    }

    /**
     * 根据动物ID查询动物
     *
     * @param id 动物ID
     */
    async findOneAnimal(id: number): Promise<Animal> {
        return this.findOneById(id);
    }

    /**
     * 根据ID查询单个动物信息，如果不存在则抛出404异常
     * @param id 动物ID
     */
    private async findOneById(id: number): Promise<Animal> {
        const animalInfo = await this.animalRepo.findOne(id);
        if (!animalInfo) {
            throw new HttpException(`指定 id=${id} 不存在`, 404);
        }
        return animalInfo;
    }
}
