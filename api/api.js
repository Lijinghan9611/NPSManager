import {
	getServerItem
} from "@/utils/common.js";

import request from "@/libs/request/index.js"

import MD5 from 'crypto-js/md5';

function getConfig(item, data) {
	let config = {};
	if (item.connectType == 1) {
		config.baseUrl = item.url
	}
	
	return config;
}

function GetServerTime(id) {
	let item = getServerItem(id);
	if (!item)
		return;

	let config = getConfig(item);

	return request
		.post('/auth/gettime', config);
}

function GetServerTimeResult(id) {
	return new Promise(function (resolve, rejects) {
		GetServerTime(id)
			.then(res => {
				resolve(res.time);
			}).catch(err => {
				rejects(err);
			})
	})
}

async function GetToken(item){
	let time = await GetServerTimeResult(item.id);
	let encryptStr = item.authKey + time;
	let auth_key = MD5(encryptStr).toString()
	return {
		timestamp:time,
		auth_key:auth_key
	}
}

async function GetData(path, id, data){
	let item = getServerItem(id);
	let vifData = await GetToken(item);
	let config = getConfig(item);
	data = { ... data, ...vifData };
	path += "?";
	for(let key in data){
		path += key + "=" + data[key] + "&"
	}
	
	return request
		.post(path, config);
}


async function GetClientList(id, data) {
	return GetData("/client/list", id, data);
}

async function GetClient(id, data) {
	return GetData("/client/getclient", id, data);
}

export {
	GetServerTime,
	GetClientList,
	GetClient
}
