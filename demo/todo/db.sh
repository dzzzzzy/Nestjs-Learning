# 创建待办事项数据库容器
docker run --name todo-mongo -d -p 27017:27017 mongo:4.0.9

# powershell 的停止并删除待办事项数据库容器
(docker stop todo-mongo) -and (docker rm todo-mongo)

# 停止并删除待办事项数据库容器
docker stop todo-mongo ; docker rm todo-mongo
