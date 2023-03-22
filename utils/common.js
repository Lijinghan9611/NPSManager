const serverKey = "NPSServerList";

function setServerItem(item) {
	delServerItem(item.id);
	let list = getServers();
	list.push(item);
	uni.setStorageSync(serverKey, JSON.stringify(list));
}

function getServerItem(id) {
	let list = getServers();
	return list.find(a => a.id === id);
}


function delServerItem(id) {
	let list = getServers();
	let index = list.findIndex(a => a.id === id);
	console.log(index)
	if (index != -1) {
		list.splice(index, 1);
		uni.setStorageSync(serverKey, JSON.stringify(list));
	}
}


function getServers() {
	let list = uni.getStorageSync(serverKey);
	if (!list)
		list = []
	else {
		try {
			list = JSON.parse(list);
		} catch (e) {
			console.log(e)
			list = [];
		}
	}

	return list;
}


function showErrorFun(data) {
	try {
		
		if(typeof data === "string"){
			uni.showModal({
				title: "获取失败",
				content: data
			});
			return;
		}
		
		//接口出错提示设置
		if (!data) {
			uni.showToast({
				icon: "error",
				title: "获取失败",
				position: "bottom"
			});
			return;
		}

		data.Message = data.Message || data.message || data.msg || data.errMsg;
		if (data.Message) {
			uni.showModal({
				title: "获取失败",
				content: data.Message
			});
			return;
		}
	} catch (e) {
		//TODO handle the exception
	}
	uni.showModal({
		title: "获取失败",
		content: "获取失败,请重试"
	});
}


function formatDate(targetDate, type) {
	var date = targetDate || new Date();
	var year = date.getFullYear();
	var month = _formatNumber(date.getMonth() + 1);
	var day = _formatNumber(date.getDate());
	var hour = _formatNumber(date.getHours());
	var minute = _formatNumber(date.getMinutes());
	var sec = _formatNumber(date.getSeconds());
	var msec = date.getMilliseconds();

	function _formatNumber(num) {
		return num < 10 ? "0" + num : num;
	}

	if (type === 0)
		return year + month + day + hour + minute + sec + msec;
	else if (type === 1)
		return year + "-" + month + "-" + day;
	else
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
}

function formatBytes(sizeBytes) {
	let memoryUnits = [{
			unitName: 'bytes',
			threshold: 1024,
		},
		{
			unitName: 'KB',
			threshold: 1024,
		},
		{
			unitName: 'MB',
			threshold: 1024,
		}, {
			unitName: 'GB',
			threshold: 1024,
		}, {
			unitName: 'TB',
			threshold: 1024,
		},
	]

	let tempFileSize = sizeBytes;
	let matchIndex = -1;

	for (let i = 0, end = false; i < memoryUnits.length; i++) {
		let memoryUnit = memoryUnits[i],
			end = i === memoryUnits.length - 1
		if (tempFileSize <= memoryUnit.threshold || end) {
			matchIndex = i;
			break;
		}

		tempFileSize = tempFileSize / memoryUnit.threshold
	}
	if(tempFileSize != 0)
		tempFileSize = tempFileSize.toFixed(2);
	return {
		fileSize: tempFileSize,
		unit:memoryUnits[matchIndex].unitName,
		matchUnit: memoryUnits[matchIndex],
		originalFileSize: sizeBytes,
	};
}

export {
	setServerItem,
	getServers,
	getServerItem,
	delServerItem,
	showErrorFun,
	formatDate,
	formatBytes
}
