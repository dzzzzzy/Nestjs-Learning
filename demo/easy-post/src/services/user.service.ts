import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CryptoUtil } from '../utils/crypto.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil
    ) { }

    /**
     * 用户登录
     *
     * @param account 登录账号
     * @param password 登录密码
     */
    async login(account: string, password: string): Promise<void> {
        const user = await this.findOneByAccount(account);
        if (!user) throw new HttpException('登录账号有误', 406);
        if (!await this.cryptoUtil.checkPassword(password, user.password)) throw new HttpException('登录密码有误', 406);
    }

    /**
     * 用户注册
     *
     * @param user 用户信息
     */
    async register(user: User): Promise<void> {
        const existing = await this.findOneByAccount(user.account);
        if (existing) throw new HttpException('账号已存在', 409);
        user.password = await this.cryptoUtil.encryptPassword(user.password);
        await this.userRepo.save(this.userRepo.create(user));
    }

    /**
     * 通过登录账号查询用户
     *
     * @param account 登录账号
     */
    async findOneByAccount(account: string): Promise<User> {
        return await this.userRepo.findOne({ account });
    }
}