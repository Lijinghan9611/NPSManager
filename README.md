# NPSManager
NPS 手机端管理

基于Uniapp开发的前端页面，用于管理nps，可发布到多端，具体支持看uniapp官网
由于小程序请求网络需要配置请求的连接，项目加了NodeJs来转发，具体看NPSNodeJsServer文件夹


注：所有的配置都存放在本地，中间不存放任何数据

运行：
终端执行 npm install安装需要的包


部署nodejs服务端时
服务端的config.js中的route_getdata需要和/config/options.js的ServerPath路径对应上