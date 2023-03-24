import {
	createStore
} from 'vuex'

var ClientId = uni.getStorageSync('ClientId');
//初始化狀態恢復
var LoginInfoStr = uni.getStorageSync('LoginInfo');
var LoginInfo = {}
try {
	LoginInfo = JSON.parse(LoginInfoStr);
} catch (e) {
	LoginInfo = {}
}
LoginInfo.currentServer = LoginInfo.currentServer || {}
const store = createStore({
	state: {
		login: LoginInfo.token && LoginInfo.token.trim() != '' ? true : false, //是否已經登錄
		token: LoginInfo.token, //請求token
		avatarUrl: LoginInfo.avatarUrl, //頭像
		userID: LoginInfo.userID, //用戶ID
		phone: LoginInfo.phone, //用戶手機號碼
		userName: LoginInfo.userName, //用戶名
		platform: "", //平台類型, ios android wx h5
		IsIOS: false, //是否為ios
		IsAndroid: false, //是否為android
		appVersion: "",
		ClientId: ClientId ? ClientId : "",
		currentServer: LoginInfo.currentServer
	},
	mutations: {
		/**
		 * 设置当前的服务器
		 * */
		SET_CurrentServer(state, inf) {
			state.currentServer = inf;
			uni.setStorageSync('LoginInfo', JSON.stringify(state));
		},
		/**
		 * 設置token等信息
		 * */
		SET_Token(state, inf) {
			state.token = "bearer " + inf.token;
			uni.setStorageSync('tokenUpdateTime', new Date().getDate());
		},
		/**
		 * 設置平台信息
		 * */
		SET_SYS_INFO(state, sysInfo) {
			sysInfo = sysInfo ? sysInfo : {};
			state.platform = sysInfo.platform ? sysInfo.platform : "";

			// #ifdef MP-WEIXIN
			state.platform = "wx";
			//#endif

			// #ifdef H5
			state.platform = "h5";
			//#endif

			if (sysInfo.platform && sysInfo.platform.trim().toLowerCase() == "ios") {
				state.IsIOS = true;
				state.IsAndroid = false;
			} else if (sysInfo.platform && sysInfo.platform.trim().toLowerCase() == "android") {
				state.IsIOS = false;
				state.IsAndroid = true;
			}
		},
		/**
		 * 設置app版本
		 * */
		SET_APPVersion(state, inf) {
			// #ifdef APP-PLUS
			state.appVersion = inf.version;
			// #endif
		},
		/**
		 * 設置app ClientId
		 * */
		SET_ClientId(state, id) {
			id = id + "_" + state.platform
			state.ClientId = id;
			uni.setStorageSync('ClientId', id);
		},
		login(state, provider) { //登錄信息
			let UserInfo = provider.UserInfo;
			state.login = true;
			if (UserInfo.access_token)
				state.token = "bearer " + UserInfo.access_token;
			if (UserInfo.loginType || UserInfo.loginType === 0 || UserInfo.loginType === "0")
				state.loginType = UserInfo.loginType;

			if (UserInfo.Phone)
				state.phone = UserInfo.Phone;

			if (UserInfo.YHName)
				state.userName = UserInfo.YHName;

			if (UserInfo.TXURLShow)
				state.avatarUrl = UserInfo.TXURLShow;

			if (UserInfo.MM)
				state.MM = UserInfo.MM;

			if (UserInfo.RoleName)
				state.RoleName = UserInfo.RoleName;

			if (!state.token || state.token.trim() == '') {
				console.log("token empty")
			}

			uni.setStorageSync('LoginInfo', JSON.stringify(state));
		},
		logout(state) {
			console.log("logout");
			state.token = '';
			state.userName = '';
			state.avatarUrl = '';
			state.phone = "";
			state.userID = "";
			state.MM = "";
			uni.removeStorageSync('LoginInfo');

			store.commit('login', {
				UserInfo: {
					loginType: state.loginType
				}
			})

			state.login = false;
		}
	}
})
export default store
