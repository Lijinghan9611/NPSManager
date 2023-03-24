// 引入網絡插件
import request from '@/libs/request/request.js';
// 引入配置文件
import {ServerPath} from '@/config/options.js';
import store from '@/store'

// 全局配置
request.setConfig({
	baseUrl: ServerPath, //需加入到域名白名單
	dataType: 'json', // 可刪除，默認為json
	responseType: 'application/json', // 可刪除，默認為text
	// 設置請求頭，支持所有請求頭設置，也可不設置，去掉header就行
	header: {
		'content-type': 'application/json'
	}
})

// 設置前請求攔截器
request.interceptors.request(config => {
	// 配置參數和全局配置相同，此優先級最高，會覆蓋在其他地方的相同配置參數
	// 追加請求頭，推薦
	config.header.Authorization = store.state.token;
	if (!config.header.Authorization || config.header.Authorization == "") {
	}

	// #ifdef MP-WEIXIN
	config.header.mobiletype = "wx";
	// #endif

	// #ifdef H5
	config.header.mobiletype = "h5";
	// #endif

	// #ifdef APP-PLUS
	if (store.state.IsIOS) {
		config.header.mobiletype = "ios";
	} else if (store.state.IsAndroid) {
		config.header.mobiletype = "android";
	}
	// #endif

	config.header.ClientId = store.state.ClientId //AppID
	config.header.appVersion = store.state.appVersion //App版本

	return config; // 返回修改後的配置，如未修改也需添加這行
})

// 設置響應後攔截器
request.interceptors.response(res => {
	// return false;    // 阻止返回,頁面不會接收返回值
	// return {message: '自定義值，來自攔截器'};   // 返回您自定義的值，將覆蓋原始返回值
	// return Promise.reject('error from response interceptors') // 向外層拋出錯誤，用catch捕獲
	var data = {};
	switch (res.statusCode) {
		case 404:
			data = {
				Code: 404,
				Message: "404 Not Found"
			};
			break;
		case 401:
			data = {
				Code: 401,
				Message: "未授权"
			};
			console.log(res);
			break;
		default:
			data = res.data ? res.data : res;
	}

	if (res.errMsg && res.errMsg.indexOf("request:fail") != -1) {
		data = {
			Code: 500,
			Message: "请求失败"
		};
	}
	if(data.isFromProxy){
		if(data.code == 1){
			return data.data;
		}
		return {
			Code: 500,
			Message: data.msg
		}
	}
	return data; // 原樣返回
})

export default request;