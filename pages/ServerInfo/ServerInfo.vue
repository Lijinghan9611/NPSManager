<template>
	<view>
		<Server :serverId="serverId"></Server>
		
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
			
			<view @click.stop style="text-align: right;margin-top: 10px;">
				<button type="warn" style="margin-right: 10px;" @click.stop="delItem(item)" size="mini">删除</button>
				<button type="primary" @click.stop="editItem(item)" size="mini">编辑</button>
			</view>
		</BaseBox>
		<view style="height: 100px;"></view>
		<uni-fab :popMenu="false" @fabClick="editItem()" horizontal="right"></uni-fab>
	</view>
</template>

<script>
import { GetServerTime, GetClientList, PostDelClient } from '@/api/api.js';
import { formatDate, formatBytes, setCollectItem, getCollectItem, delCollectItem } from '@/utils/common.js';

import { timeOutTimes } from '@/config/options.js';
import Server from "./Server.vue"
export default {
	components:{
		Server
	},
	data() {
		return {
			serverId: '',
			serverTime: '',
			onlineServerData: {
				rows: []
			},
			timeOut: undefined
		};
	},
	onLoad(opt) {
		this.serverId = this.$store.state.currentServer.id;
	},
	onShow() {
		this.init(1);
		this.startGetData();
	},
	onHide() {
		this.stopGetData();
	},
	onUnload() {
		this.stopGetData();
	},
	methods: {
		
		delItem(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除客戶端吗？',
				success: res => {
					if (res.confirm) {
						PostDelClient(this.serverId, {
								id: item.Id,
							})
							.then(res => {
								console.log(res);
								uni.showToast({
									title: "操作成功"
								})
								this.loadData();
							})
							.catch(error => {
								this.$showError(error);
							});
		
					}
				}
			});
		},
		editItem(item){
			if(item?.Id){
				uni.navigateTo({
					url: "/pages/client/client?id=" + item.Id
				})
			}
			else{
				uni.navigateTo({
					url: "/pages/client/client"
				})
			}
			this.stopGetData();
		},
		init(load) {
			this.loadData(load);
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
		goDetail(item) {
			this.stopGetData();
			uni.navigateTo({
				url: '/pages/TunnelAllList/TunnelAllList?id=' + item.Id + "&serverId=" + this.serverId
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
