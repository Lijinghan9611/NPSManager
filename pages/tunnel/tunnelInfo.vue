<template>
	<view>
		<BaseBox hover @longpress="delItem(item)">
			<view class="flex flex-align-items underline">
				<image src="/static/images/icon-tunnel.png" class="item-icon"></image>
				<uni-title type="h4" :title="item.Remark ? item.Remark : ' '" align="left"></uni-title>
			</view>
			
			<view class="flex">
				<view class="flex-1">
					<BaseText title="运行状态">
						<view class="box-text box-text-active" v-if="item.RunStatus">在线</view>
						<view class="box-text" v-else>离线</view>
					</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="状态">
						<view class="box-text box-text-active" v-if="item.Status">开放</view>
						<view class="box-text" v-else>关闭</view>
					</BaseText>
				</view>
			</view>
			<view class="flex">
				<view class="flex-1">
					<BaseText title="模式">{{ item.Mode }}</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="端口">{{ item.Port }}</BaseText>
				</view>
			</view>
			<BaseText title="目标 (IP:端口)">{{ item.Target?.TargetStr }}</BaseText>
			
			
			<view @click.stop class="flex flex-align-items" style="margin-top: 10px;">
				<BaseText title="所属"  v-if="isShow">{{localServerData.name}}/{{clientInfo.Remark}}</BaseText>
				<view class="flex-1"></view>
				<button type="warn" @click.stop="stopTunnel(item)" size="mini" v-if="item.Status">停止</button>
				<button type="default" class="btn-primary" hover-class="btn-hover" @click.stop="startTunnel(item)" size="mini" v-else>启动</button>
			</view>
		</BaseBox>
	</view>
</template>

<script>
import { GetOneTunnel, PostStartTunnel, PostStopTunnel ,GetClient} from '@/api/api.js';
import {
	delCollectItem ,getServerItem
} from '@/utils/common.js';
export default {
	props: {
		serverId: [String, Number],
		clientId: [String, Number],
		tunnelId: [String, Number],
		collectId:[String, Number],
		isShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			item: {},
			IsCollect: false,
			clientInfo:{},
			localServerData:{}
		};
	},
	created() {
		this.init();
		this.localServerData = getServerItem(this.serverId);
		this.GetClientInfo();
	},
	methods: {
		init() {
			this.loadData();
		},
		GetClientInfo(load) {
			if (load)
				uni.showLoading({
					title: '加载中，请稍候...'
				});
			GetClient(this.serverId, {
					id: this.clientId
				})
				.then(res => {
					if (load) uni.hideLoading();
					console.log(res);
					this.clientInfo = res.data;
				})
				.catch(error => {
					if (load) uni.hideLoading();
					this.$showError(error);
				});
		},
		loadData() {
			GetOneTunnel(this.serverId, {
				id: this.tunnelId
			})
				.then(res => {
					console.log(res);
					this.item = res.data;
					//this.checkIsCollect();
				})
				.catch(error => {
					this.$showError(error);
				});
		},
		stopTunnel() {
			uni.showModal({
				title: '提示',
				content: '确定要停止隧道吗？',
				success: res => {
					if (res.confirm) {
						PostStopTunnel(this.serverId, {
							id: this.item.Id
						})
							.then(res => {
								console.log(res);
								uni.showToast({
									title: '操作成功'
								});
								this.loadData();
							})
							.catch(error => {
								this.$showError(error);
							});
					}
				}
			});
		},
		startTunnel(item) {
			uni.showModal({
				title: '提示',
				content: '确定要启动隧道吗？',
				success: res => {
					if (res.confirm) {
						PostStartTunnel(this.serverId, {
							id: this.item.Id
						})
							.then(res => {
								console.log(res);
								uni.showToast({
									title: '操作成功'
								});
								this.loadData();
							})
							.catch(error => {
								this.$showError(error);
							});
					}
				}
			});
		},
		delItem() {
			this.IsLongtap = true;
			uni.showActionSheet({
				itemList: ["取消收藏"],
				itemColor: '#FF0000', //App-iOS、字节跳动小程序不支持
				success: res => {
					this.IsLongtap = false;
					if (res.tapIndex == 0) {
						delCollectItem(this.collectId);
						this.$emit("updateCollect");
					}
				},
				fail: err => {
					this.IsLongtap = false;
				}
			});
		},
	}
};
</script>

<style></style>
