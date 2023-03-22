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
	return new Promise(function(resolve, rejects) {
		GetServerTime(id)
			.then(res => {
				resolve(res.time);
			}).catch(err => {
				rejects(err);
			})
	})
}

async function GetToken(item) {
	let time = await GetServerTimeResult(item.id);
	let encryptStr = item.authKey + time;
	let auth_key = MD5(encryptStr).toString()
	return {
		timestamp: time,
		auth_key: auth_key
	}
}

async function GetData(path, id, data) {
	let item = getServerItem(id);
	let vifData = await GetToken(item);
	let config = getConfig(item);
	data = {
		...data,
		...vifData
	};
	path += "?";
	for (let key in data) {
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

//获取隧道列表
async function GetTunnelList(id, data) {
	return GetData("/index/gettunnel/", id, data);
}

//获取域名解析列表
async function GetHostList(id, data) {
	return GetData("/index/hostlist/", id, data);
}

//隧道停止工作
async function PostStopTunnel(id, data) {
	return GetData("/index/stop/", id, data);
}


async function PostStartTunnel(id, data) {
	return GetData("/index/start/", id, data);
}

async function PostDelTunnel(id, data) {
	return GetData("/index/del/", id, data);
}

async function PostDelHost(id, data) {
	return GetData("/index/delhost/", id, data);
}

export {
	GetServerTime,
	GetClientList,
	GetClient,
	GetTunnelList,
	GetHostList,
	PostStartTunnel,
	PostStopTunnel,
	PostDelTunnel,
	PostDelHost
}
