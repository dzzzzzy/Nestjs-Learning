import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, TodoSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { PasswordModule } from '../../common/password/password.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Todo', schema: TodoSchema },
    ]),
    forwardRef(() => AuthModule),
    PasswordModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
