import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalController } from './animal.controller';
import { Animal } from './animal.entity';
import { AnimalService } from './animal.service';

@Module({
    imports: [TypeOrmModule.forFeature([Animal])],
    controllers: [AnimalController],
    providers: [AnimalService],
})
export class AnimalModule { }
