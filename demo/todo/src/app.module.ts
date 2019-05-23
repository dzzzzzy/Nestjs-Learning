import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './feature/users/users.module';
import { AuthModule } from './feature/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, AuthModule, MongooseModule.forRoot('mongodb://localhost/todo')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
