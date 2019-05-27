import * as mongoose from 'mongoose';

export const TodoSchema = new mongoose.Schema({
    complete: {
      type: Boolean,
    },
    todo: {
      type: String,
    },
});
