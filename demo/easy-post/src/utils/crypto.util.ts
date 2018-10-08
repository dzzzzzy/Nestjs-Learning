import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class CryptoUtil {

    /**
     * 加密登录密码
     *
     * @param password 登录密码
     */
    encryptPassword(password: string): string {
        return createHash('sha256').update(password).digest('hex');
    }

    /**
     * 检查登录密码是否正确
     *
     * @param password 登录密码
     * @param encryptedPassword 加密后的密码
     */
    checkPassword(password: string, encryptedPassword): boolean {
        const currentPass = this.encryptPassword(password);
        if (currentPass === encryptedPassword) {
            return true;
        }
        return false;
    }
}