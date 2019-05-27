import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Todo } from '../users/interfaces/user.interface';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Todo') private readonly todoModel: Model<Todo>,
  ) { }

  async createOne(account: string, todo: string) {
    // 查找用户
    const user = await this.userModel.findOne({ account });
    // 新建待办事项
    const createdTodo = new this.todoModel({
      complete: false,
      todo,
    });
    // 插入待办事项
    await user.todos.push(createdTodo);
    // 保存
    return user.save();
  }

// tslint:disable-next-line: variable-name
  async deleteOne(account: string, _id: string) {
    // 删除指定的待办事项
    return this.userModel.updateOne({ account }, {
      $pull: {
        todos: {
          _id,
        },
      },
    });
  }

// tslint:disable-next-line: variable-name
  async updateOne(account: string, _id: string, complete?: boolean, todo?: string) {
    // 只有 complete 填写时
    if ('boolean' === typeof complete && 'string' !== typeof todo) {
      return this.userModel.updateOne({ account }, {
        $set: {
          'todos.$[elem].complete': complete,
        },
      },
        { arrayFilters: [{ 'elem._id': _id }] },
      );
    }
    // 只有 todo 填写时
    if ('string' === typeof todo && 'boolean' !== typeof complete) {
      return this.userModel.updateOne({ account }, {
        $set: {
          'todos.$[elem].todo': todo,
        },
      },
        { arrayFilters: [{ 'elem._id': _id }] },
      );
    }
    // complete todo 都填写时
    if ('boolean' === typeof complete && 'string' === typeof todo) {
      return this.userModel.updateOne({ account }, {
        $set: {
          'todos.$[elem].complete': complete,
          'todos.$[elem].todo': todo,
        },
      },
        { arrayFilters: [{ 'elem._id': _id }] },
      );
    }
    // 修改一条待办事项
    throw {
      error: `参数不正确，complete: ${complete}, todo: ${todo}`,
      message: '请传递正确类型的参数',
    };
  }

  async findAll(account: string) {
    const ret = await this.userModel.findOne({ account }, '-_id todos');
    return ret.todos;
  }
}
