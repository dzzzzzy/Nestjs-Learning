import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hash(plaintextPassword: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plaintextPassword, saltRounds);
  }

  async compare(plaintextPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, hash);
  }
}
