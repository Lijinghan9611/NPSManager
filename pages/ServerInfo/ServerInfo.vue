<template>
	<view>
		<BaseBox>
			<uni-title type="h3" class="underline" :title="localServerData.name" align="left"></uni-title>
			<BaseText title="链接">{{ localServerData.url }}</BaseText>
			<BaseText title="秘钥">{{ localServerData.authKey }}</BaseText>
			<BaseText title="服务器时间">
				{{ serverTime }}
				<text class="link" @click="getTime(1)">刷新</text>
			</BaseText>

			<view class="flex">
				<view class="flex-1">
					<BaseText title="ip">{{ onlineServerData.ip }}</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="端口">{{ onlineServerData.bridgePort }}</BaseText>
				</view>
			</view>

			<view class="flex">
				<view class="flex-1">
					<BaseText title="桥接模式">{{ onlineServerData.bridgeType }}</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="客戶端数量">{{ onlineServerData.total }}</BaseText>
				</view>
			</view>
		</BaseBox>
		<view class="base-margin"><uni-title type="h3" title="客戶端列表" align="left"></uni-title></view>

		<BaseBox @click="goDetail(item)" hover v-for="item in onlineServerData.rows" :key="item.Id">
			<view class="flex flex-align-items underline">
				<uni-title type="h4" :title="item.Remark" align="left"></uni-title>
				<view class="rate-text flex-1">{{ formatRate(item.Rate?.NowRate) + '/s' }}</view>
				<view class="box-text box-text-active" v-if="item.Status">开放</view>
				<view class="box-text" v-else>关闭</view>
			</view>
			<view class="flex">
				<view class="flex-1">
					<BaseText title="连接">
						<view class="box-text box-text-active" v-if="item.IsConnect">在线</view>
						<view class="box-text" v-else>离线</view>
					</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="版本">{{ item.Version }}</BaseText>
				</view>
			</view>
			<view class="flex">
				<view class="flex-1">
					<BaseText title="流量(入)">{{ formatBytesToStr(item.Flow?.InletFlow) }}</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="流量(出)">{{ formatBytesToStr(item.Flow?.ExportFlow) }}</BaseText>
				</view>
			</view>
			<BaseText title="验证密钥">{{ item.VerifyKey }}</BaseText>
			<BaseText title="客户端地址">{{ item.Addr }}</BaseText>
		</BaseBox>
	</view>
</template>

<script>
import { GetServerTime, GetClientList } from '@/api/api.js';
import { getServerItem, formatDate, formatBytes } from '@/utils/common.js';

import { timeOutTimes } from '@/config/options.js';
export default {
	data() {
		return {
			serverId: '',
			serverTime: '',
			localServerData: {},
			onlineServerData: {
				rows: []
			},
			timeOut: undefined
		};
	},
	onLoad(opt) {
		this.serverId = this.$store.state.currentServer.id;

		this.init(1);
	},
	onShow() {
		this.startGetData();
	},
	onHide() {
		this.stopGetData();
	},
	onUnload() {
		this.stopGetData();
	},
	methods: {
		async init(load) {
			this.localServerData = getServerItem(this.serverId);
			this.loadData(load);
			this.getTime();
			this.startGetData();
		},
		startGetData() {
			this.stopGetData();
			this.timeOut = setTimeout(() => {
				this.init();
			}, timeOutTimes);
		},
		stopGetData() {
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
		},
		formatRate(bytes) {
			let res = formatBytes(bytes);
			if (res.fileSize == 0) return 0 + 'B';

			return res.fileSize + res.unit;
		},
		formatBytesToStr(bytes) {
			let res = formatBytes(bytes);
			return res.fileSize + res.unit;
		},
		loadData(load) {
			if (load)
				uni.showLoading({
					title: '加载中，请稍候...'
				});
			GetClientList(this.serverId, {
				start: 0,
				limit: 10
			})
				.then(res => {
					if (load) uni.hideLoading();
					console.log(res);
					if(!res.ip){
						this.$showError("获取信息失败，请检查配置是否正确");
					}
					this.onlineServerData = res;
				})
				.catch(error => {
					if (load) uni.hideLoading();
					this.$showError(error);
				});
		},
		getTime(loading) {
			if (loading)
				uni.showLoading({
					title: '加载中，请稍候...'
				});
			GetServerTime(this.serverId)
				.then(res => {
					if (loading) uni.hideLoading();
					this.serverTime = formatDate(new Date(res.time * 1000));
				})
				.catch(error => {
					if (loading) uni.hideLoading();
					this.$showError(error);
				});
		},
		goDetail(item) {
			uni.navigateTo({
				url: '/pages/TunnelAllList/TunnelAllList?id=' + item.Id
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
	}
};
</script>

<style lang="scss">
.rate-text {
	padding: 0 10px;
	text-align: right;
}
</style>
