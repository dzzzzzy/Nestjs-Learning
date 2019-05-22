import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async hasUser(user: string): Promise<boolean> {
    return user !== undefined && user !== null;
  }
}
