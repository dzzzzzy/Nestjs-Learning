import { Controller, Post, HttpCode, Body, UseGuards, Req, Delete, Param, Patch, Res, Get } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from '../auth/interfaces/user-request.interface';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Response } from 'express';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
  ) { }

  @Post()
  @HttpCode(200)
  async createTodo(@Req() req: UserRequest, @Body() createTodoDto: CreateTodoDto) {
    // 创建一条待办事项
    const account = req.user.account;
    const user = await this.todosService.createOne(account, createTodoDto.todo);
    // 返回待办事项的 id
    const _id = user.todos[user.todos.length - 1]._id;
    return {
      _id,
    };
  }

  @Delete(':_id')
  @HttpCode(204)
// tslint:disable-next-line: variable-name
  async deleteTodo(@Req() req: UserRequest, @Param('_id') _id: string) {
    // 删除一条待办事项
    const account = req.user.account;
    return await this.todosService.deleteOne(account, _id);
  }

  @Patch(':_id')
  @HttpCode(204)
// tslint:disable-next-line: variable-name
  async updateTodo(@Req() req: UserRequest, @Param('_id') _id: string, @Body() updateTodoDto: UpdateTodoDto, @Res() res: Response) {
    // 修改一条待办事项
    const account = req.user.account;
    const { complete, todo } = updateTodoDto;
    try {
      await this.todosService.updateOne(account, _id, complete, todo);
      res.end();
    } catch ({ error, message }) {
      res.status(400).json({
        error,
        message,
      });
    }
  }

  @Get()
  async findAll(@Req() req: UserRequest) {
    const account = req.user.account;
    return await this.todosService.findAll(account);
  }
}
