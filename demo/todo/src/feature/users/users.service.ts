import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../../common/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly password: PasswordService,
    ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 加密密码
    const hashPassword = await this.password.hash(createUserDto.password);
    // 创建新用户
    const createdUser = new this.userModel({
      account: createUserDto.account,
      password: hashPassword,
    });
    // 保存新用户
    return await createdUser.save();
  }

  async isPasswordCorrect(account: string, password: string): Promise<boolean> {
    // 根据账号查询用户
    const user = await this.userModel.findOne({ account });
    // 若查询不到用户，则返回假
    if (!user) {
      return false;
    }
    // 判断密码是否匹配
    return this.password.compare(password, user.password);
  }

  async hasUser(account: string): Promise<boolean> {
    // 根据账号查询用户是否存在
    return await this.userModel.findOne({ account }) !== null;
  }

  async findOneByAccountAndPassword(account: string, password: string) {
    return await this.userModel.findOne({ account, password: await this.password.hash(password) });
  }
}
