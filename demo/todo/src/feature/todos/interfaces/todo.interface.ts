import { Document } from 'mongoose';

export interface User extends Document {
  readonly account: string;
  readonly password: string;
}
