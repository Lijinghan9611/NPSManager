# NPS NodeJS 管理服务端
NPS NodeJS 管理服务器，用于转接获取nps的接口数据

docker镜像制作：
1.把除node_modules文件夹，复制到服务器

2.制作镜像
sudo docker build -t nps-nodejs-server .

3.查看镜像
docker images

4.运行
sudo docker run -d --name nps-nodejs-server -p 8026:8026 nps-nodejs-server

其他docker操作：
列举docker容器 	docker ps -a
停止容器			docker stop nps-nodejs-server
删除容器：		docker rm nps-nodejs-server
列举docker镜像	docker images
删除镜像			docker rmi nps-nodejs-server

