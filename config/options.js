//转接服务器的位置
var ServerPath = 'http://127.0.0.1:8124/api/getdata';
var Server = 'http:///';
if (process.env.NODE_ENV === 'development') { //开发环境
	console.log('development');
} else {
	console.log('product');
}


//全局页面数据
const pageSize = 30;

//全局定时器市场
const timeOutTimes = 5000;

export {
	ServerPath,
	Server,
	pageSize,
	timeOutTimes
}
