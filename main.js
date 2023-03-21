// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

import App from './App.vue'
import store from './store'

// 掛載到全局vue實例上，在頁面中可以使用this.$request調用request實例下相應方法
import request from '@/libs/request';
import {showErrorFun} from "@/utils/common.js"

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$request = request;
	app.config.globalProperties.$showError = showErrorFun;
	
	return {
		app
	}
}
// #endif
