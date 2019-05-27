import * as mongoose from 'mongoose';

export const TodoSchema =  new mongoose.Schema({
  complete: {
    type: Boolean,
  },
  todo: {
    type: String,
  },
});

export const UserSchema = new mongoose.Schema({
  account: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
  todos: [TodoSchema],
});
