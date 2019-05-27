import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  /**
   * 生成 hash 后的密码
   * @param plaintextPassword 明文密码
   * @returns 加密后的密码
   */
  async hash(plaintextPassword: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plaintextPassword, saltRounds);
  }

  /**
   * 对比明文密码和密文密码，是否一致
   * @param plaintextPassword 明文密码
   * @param hash 要比较的密文密码
   * @returns 是否一致
   */
  async compare(plaintextPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, hash);
  }
}
