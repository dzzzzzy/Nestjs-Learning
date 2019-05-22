# `Todo`

待办事项 `RESTful APIs` ，技术上使用 `JWT` 、`MongoDB` 、`Typeorm` ，功能上实现注册、登录、待办事项增删改查

## 目录说明

- `/src/common` 公共的 `interface`、`decorators`

- `/src/core` 核心的 `guards`
- `/src/feature ` 业务功能


## `RESTful APIs`

### `/auth`

#### 获取 `Token`

```json
GET /auth/token
user: <用户>
password: <密码>
```

```json
200 OK

{
	"token": "<token>"
}
```

### `/users`

#### 创建一个用户

```json
POST /users
Content-Type: application/json

{
    "user": "<用户>",
    "password": "<密码>"
}
```

```json
200 OK

{
    "token": "<token>"
}
```

### `/todos`

#### 创建一个待办事项


```json
POST /todos
Content-Type: application/json
Authorization: Bearer <token>

{
	"todo": "<待办事项内容>"
}
```

```json
200 OK

{
    "id": "<待办事项的id>"
}
```

#### 删除一个待办事项

```json
DELETE /todos/:id
Authorization: Bearer <token>
```

```json
204 No Content
```

#### 改变一个待办事项

```json
PATCH /todos/:id
Content-Type: application/json
Authorization: Bearer <token>

{
    "complete":? <true | false>,
    "todo":? "<待办事项内容>"
}
```

```json
204 No Content
```

#### 查询一些待办事项

```json
GET /todos
Authorization: Bearer <token>
```

```json
200 OK

{
	"todos": [
        { "complete": <true | false>, "todo": "<待办事项内容>" },
        { "complete": <true | false>, "todo": "<待办事项内容>" },
        ...
    ]
}
```

