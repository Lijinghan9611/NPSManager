
var ServerPath = 'http:///api/';
var Server = 'http:///';
if (process.env.NODE_ENV === 'development') { //開發環境
	console.log('development');
} else {
	console.log('product');
}


//全局頁面數據大小
const pageSize = 30;

export default {
	ServerPath,
	Server,
	pageSize,
}
