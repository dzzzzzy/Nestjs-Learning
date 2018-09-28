import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class CryptoUtil {

    /**
     * 加密登录密码
     *
     * @param password 登录密码
     */
    async encryptPassword(password: string): Promise<string> {
        return createHash('sha256').update(password).digest('hex');
    }

    /**
     * 检查登录密码是否正确
     *
     * @param password 登录密码
     * @param encryptedPassword 加密后的密码
     */
    async checkPassword(password: string, encryptedPassword): Promise<boolean> {
        const currentPass = await this.encryptPassword(password);
        if (currentPass === encryptedPassword) {
            return true;
        }
        return false;
    }
}