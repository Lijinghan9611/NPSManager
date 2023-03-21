import {
	getServerItem
} from "@/utils/common.js";

import request from "@/libs/request/index.js"

function getConfig(item){
	let config = {};
	if(item.connectType == 1){
		config.baseUrl = item.url
	}
	
	return config;
}
function GetServerTime(id) {
	let item = getServerItem(id);
	if(!item)
		return;
		
	let config = getConfig(item);
	
	return request
		.post('/auth/gettime', config);
}


export {
	GetServerTime
}