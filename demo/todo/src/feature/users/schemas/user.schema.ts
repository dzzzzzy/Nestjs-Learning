import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  account: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
});
