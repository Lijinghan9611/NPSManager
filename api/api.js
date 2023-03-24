import {
	getServerItem
} from "@/utils/common.js";

import request from "@/libs/request/index.js"

import MD5 from 'crypto-js/md5';

import { ServerPath } from "@/config/options.js"

function getConfigAndPath(item, path) {
	let config = {};
	if (item.connectType == 1) {	//直连
		config.baseUrl = item.url
	}
	else { //通过转接接口
		config.baseUrl = ServerPath
		path = "?url=" + encodeURIComponent(item.url + path);
	}

	return {
		path: path,
		config : config,
	};
}


async function GetData(path, id, data) {
	let item = getServerItem(id);
	let vifData = await GetToken(item);
	data = {
		...data,
		...vifData
	};
	path += "?";
	for (let key in data) {
		path += key + "=" + data[key] + "&"
	}
	let config = getConfigAndPath(item, path);
	
	return request
	 	.post(config.path, config.config);
}

function GetServerTime(id) {
	let item = getServerItem(id);
	if (!item)
		return;

	let data = getConfigAndPath(item, '/auth/gettime');
	return request
		.post(data.path , data.config);
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

async function PostDelClient(id, data) {
	return GetData("/client/del/", id, data);
}

async function PostAddClient(id, data) {
	return GetData("/client/add/", id, data);
}
async function PostEditClient(id, data) {
	return GetData("/client/edit/", id, data);
}
async function PostAddHost(id, data) {
	return GetData("/index/addhost/", id, data);
}
async function PostEditHost(id, data) {
	return GetData("/index/edithost/", id, data);
}

async function PostAddTunnel(id, data) {
	return GetData("/index/add/", id, data);
}
async function PostEditTunnel(id, data) {
	return GetData("/index/edit/", id, data);
}

async function GetOneTunnel(id, data) {
	return GetData("/index/getonetunnel/", id, data);
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
	PostDelHost,
	PostDelClient,
	PostAddClient,
	PostEditClient,
	PostAddHost,
	PostEditHost,
	PostAddTunnel,
	PostEditTunnel,
	GetOneTunnel
}
