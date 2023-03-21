const serverKey = "NPSServerList";
function setServerItem(item){
	delServerItem(item.id);
	let list = getServers();
	list.push(item);
	uni.setStorageSync(serverKey, JSON.stringify(list));
}

function getServerItem(id){
	let list = getServers();
	return list.find(a => a.id === id);
}


function delServerItem(id){
	let list = getServers();
	let index = list.findIndex(a => a.id === id);
	console.log(index)
	if(index != -1){
		list.splice(index, 1);
		uni.setStorageSync(serverKey, JSON.stringify(list));
	}
}


function getServers(){
	let list = uni.getStorageSync(serverKey);
	console.log(list)
	if(!list)
		list = []
	else{
		try{
			list = JSON.parse(list);
		}catch(e){
			console.log(e)
			list = [];
		}
	}
	
	return list;
}


function showErrorFun(data) {
	try {
		console.log(data)
		//接口出错提示设置
		if (!data) {
			uni.showToast({
				icon:"error",
				title:"获取失败",
				position :"bottom"
			});
			return;
		}
	
		data.Message = data.Message || data.message || data.msg || data.errMsg;
		if (data.Message) {
			uni.showModal({
				title:"获取失败",
				position :data.Message
			});
			return;
		}
	} catch (e) {
		//TODO handle the exception
	}
	uni.showModal({
		title:"获取失败",
		position : "获取失败,请重试"
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

export {
	setServerItem,
	getServers,
	getServerItem,
	delServerItem,
	showErrorFun,
	formatDate
}
