<template>
	<view>
		<BaseBox>
			<BaseText title="检查服务器时间">{{serverTime}}<text class="link" @click="getTime">刷新</text></BaseText>
		</BaseBox>
	</view>
</template>

<script>
	import {GetServerTime} from "@/api/api.js";
	import {getServerItem, formatDate} from "@/utils/common.js";
	export default {
		data() {
			return {
				id:"",
				serverTime:"",
				serverData:{}
			};
		},
		onLoad(opt) {
			this.id = opt.id;
			this.init();
		},
		methods:{
			init(){
				this.serverData = getServerItem(this.id);
				this.loadData();
				this.getTime();
			},
			loadData(){
				
			},
			getTime(){
				uni.showLoading({
					title:"加载中，请稍候..."
				})
				GetServerTime(this.id)
				.then(res => {
					uni.hideLoading()
					console.log(res);
					this.serverTime = formatDate(new Date(res.time * 1000));
				})
				.catch(error => {
					uni.hideLoading()
					this.$showError(error);
				});
			}
		},
		
		onPullDownRefresh() {
			console.log('onPullDownRefresh');
			this.pageIndex = 0;
			this.loadData();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 3000);
		},
	}
</script>

<style lang="scss">

</style>
