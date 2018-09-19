import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cat } from './cat.entity';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';

@Module({
    imports: [TypeOrmModule.forFeature([Cat])],
    providers: [CatResolver, CatService],
})
export class CatModule { }