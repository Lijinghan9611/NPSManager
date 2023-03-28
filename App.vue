<script>
	import store from './store'
	export default {
		onLaunch: function() {
			console.log('App Launch');
			uni.getSystemInfo({
				success: (res) => {
					store.commit('SET_SYS_INFO', res);
					this.$nextTick(() => {
						console.log(store.state.ClientId);
					})
					if (!store.state.ClientId || store.state.ClientId == "")
						store.commit('SET_ClientId', res.deviceId);
					console.log(store.state.platform);
				}
			});
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				store.commit('SET_APPVersion', inf);
				console.log(store.state.appVersion);
			});
			// #endif
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	// #ifndef APP-PLUS-NVUE
	/*每個頁面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/assets/css/common.scss';
	
	// 设置整个项目的樣式
	page {
		background-color: $uni-bg-color;
		font-size: $uni-font-size-base;
		color: $text-color;
	}
	
	.item-icon{
		height: 25px;
		width: 25px;
		padding: 2px;
		margin-right: 8px;
	}
	// #endif
</style>
