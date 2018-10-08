import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @InjectRepository(Post) private readonly postRepo: Repository<Post>,
        @Inject(Reflector) private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 通过反射获取请求路由是否添加了 @Roles() 注解，如果没有添加，则代表不需要进行认证
        const roles = this.reflector.get<string>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        // 在请求对象中获取 user 对象，此 user 对象是 AuthStrategy 中 validate 方法成功执行后的返回值
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        // 判断是否为管理员，或当前操作的资源是否是私人的
        const hasRole = () => user.role === 'admin';
        return user && (hasRole() || await this.isPersonal(user.id, request));
    }

    // 判断当前操作的资源是否是私人的，如果是就代表有权限，否则无权限
    private async isPersonal(userId: number, req: Request): Promise<boolean> {
        const path = req.path;
        // 普通用户只能修改或删除自己的帖子
        if (path.startsWith('/post')) {
            const postId = req.params.id;
            if (!isNaN(postId)) {
                const post = await this.postRepo.findOne(postId, { relations: ['user'] });
                if (post.user.id === userId) return true;
            }
        }
        // 普通用户只能更新自己的信息
        if (path.startsWith('/user')) {
            return req.method === 'PUT' && !isNaN(req.user.id) && req.user.id === req.params.id;
        }
        return false;
    }
}