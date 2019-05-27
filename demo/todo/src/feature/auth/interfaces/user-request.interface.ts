import { Request } from 'express';

export interface User {
  account: string;
  // roles: string[];
}

export interface UserRequest extends Request {
  user: User;
}
