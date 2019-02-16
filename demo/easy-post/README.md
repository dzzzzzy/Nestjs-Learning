# Easy-Post（便利贴）

使用 Nest 构建，一个简单的用户发帖系统。

## 功能

- [x] 注册
- [x] 登录
- [x] 用户授权（jwt)
- [x] 用户认证（简单的RBAC)
- [x] 用户管理
- [x] 帖子管理

## 项目结构

- common 用于存放公共的 interface、decorators
- core 用于存放核心的 auth、guards、interceprots
- feature 用于存放系统业务模块，用户模块、帖子模块
- shared 用于存放系统分享模块，分享模块可以被其他任意业务模块导入，并使用其分享出的 provider

## 使用说明

```bash
# 安装依赖
$ yarn install

# 创建 test 数据库

# 启动程序
$ yarn run start
```