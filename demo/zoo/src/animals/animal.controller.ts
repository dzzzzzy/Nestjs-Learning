import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common";

import { Result } from "../common/result.interface";
import { Animal } from "./animal.entity";
import { AnimalService } from "./animal.service";

@Controller("animal")
export class AnimalController {
    constructor(
        @Inject(AnimalService) private readonly animalService: AnimalService,
    ) { }

    @Post()
    async createAnimal(@Body() animal: Animal): Promise<Result> {
        await this.animalService.createAnimal(animal);
        return { code: 200, message: "创建动物成功" };
    }

    @Delete(":id")
    async deleteAnimal(@Param("id") id: number): Promise<Result> {
        await this.animalService.deleteAnimal(id);
        return { code: 200, message: "删除动物成功" };
    }

    @Put(":id")
    async updateAnimal(@Param("id") id: number, @Body() animal: Animal): Promise<Result> {
        await this.animalService.updateAnimal(id, animal);
        return { code: 200, message: "更新动物成功" };
    }

    @Get(":id")
    async findOneAnimal(@Param("id") id: number): Promise<Result> {
        const data = await this.animalService.findOneAnimal(id);
        return { code: 200, message: "查询动物成功", data };
    }
}
