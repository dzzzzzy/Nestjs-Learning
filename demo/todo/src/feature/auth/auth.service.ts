import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async signIn(account: string): Promise<string> {
    const payload: JwtPayload = { account };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<string> {
    if (await this.usersService.hasUser(payload.account)) {
      return payload.account;
    } else {
      return null;
    }
  }
}
