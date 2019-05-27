import { Document } from 'mongoose';

export interface Todo extends Document {
  readonly complete: boolean;
  readonly todo: string;
}

export interface User extends Document {
  readonly account: string;
  readonly password: string;
  readonly todos: Todo[];
}
