<template>
	<view>
		<BaseBox :hover="isShow" @click="GotoDetail" @longpress="delItem()">
			<view class="flex flex-align-items underline">
				<image src="/static/images/icon-conputer.png" class="item-icon"></image>
				<uni-title type="h4" class="flex-1" :title="clientInfo.Remark" align="left"></uni-title>
				<view class="rate-text" style="margin-right: 10px;">{{ formatRate(clientInfo.Rate?.NowRate) + '/s' }}</view>
				<view class="box-text box-text-active" v-if="clientInfo.Status">开放</view>
				<view class="box-text" v-else>关闭</view>
			</view>
			
			<view class="flex">
				<view class="flex-1">
					<BaseText title="连接">
						<view class="box-text box-text-active" v-if="clientInfo.IsConnect">在线</view>
						<view class="box-text" v-else>离线</view>
					</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="版本">{{ clientInfo.Version }}</BaseText>
				</view>
			</view>
			<view class="flex">
				<view class="flex-1">
					<BaseText title="流量(入)">{{ formatBytesToStr(clientInfo.Flow?.InletFlow) }}</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="流量(出)">{{ formatBytesToStr(clientInfo.Flow?.ExportFlow) }}</BaseText>
				</view>
			</view>
			<BaseText title="验证密钥">
				<text>{{ clientInfo.VerifyKey }}</text> 
				<text style="margin-left: 10px;" class="link" @click.stop="copy(clientInfo.VerifyKey)">复制</text>
			</BaseText>
			<BaseText title="客户端地址">{{ clientInfo.Addr }}</BaseText>
			
			<BaseText v-if="isShow" title="所属">{{localServerData.name}}</BaseText>
			
			<view v-if="clientInfo.Id && !isShow" style="text-align: right;">
				<button type="default" class="btn-primary" hover-class="btn-hover" v-if="!IsCollect" style="margin-right: 10px;" @click.stop="CollectItem()" size="mini">收藏</button>
				<button @click.stop="cancelCollectItem()" v-else style="margin-right: 10px;" size="mini">取消收藏</button>
			</view>
		</BaseBox>
		
	</view>
</template>

<script>
	import { getServerItem, formatDate, formatBytes, setCollectItem, getCollectItem, delCollectItem } from '@/utils/common.js';
	import {
		GetClient,
	} from '@/api/api.js';
	import { timeOutTimes } from '@/config/options.js';
	
	export default {
		props:{
			serverId:[String, Number],
			clientId:[String, Number],
			collectId:[String, Number],
			isShow:{
				type:Boolean,
				default:false,
			}
		},
		data(){
			return {
				clientInfo:{},
				IsCollect:false,
				IsLongtap:false,
				localServerData:{}
			}
		},
		created() {
			this.localServerData = getServerItem(this.serverId);
			this.init();
			this.startGetData();
		},
		beforeUnmount() {
			console.log("beforeUnmount")
			this.stopGetData();
		},
		methods:{
			copy(val){
				uni.setClipboardData({
					data: val,
					success: function () {
						uni.showToast({
							icon:'success',
							title:"复制成功"
						})
					}
				});

			},
			delItem() {
				if(!this.isShow){
					return;
				}
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
			GotoDetail(){
				if(!this.isShow || this.IsLongtap)
					return;
				
				uni.navigateTo({
					url: '/pages/TunnelAllList/TunnelAllList?id=' + this.clientId + "&serverId=" + this.serverId
				});
			},
			checkIsCollect(){
				let checkItem = getCollectItem("server-" + this.serverId + "-" + this.clientInfo.Id);
				if(!checkItem)
					this.IsCollect = false;
				else 
					this.IsCollect = true;
			},
			cancelCollectItem(){
				delCollectItem("server-" + this.serverId + "-" + this.clientInfo.Id);
				this.checkIsCollect();
			},
			CollectItem(){
				let data = {
					id : "server-" + this.serverId + "-" + this.clientInfo.Id,
					data : JSON.stringify(this.clientInfo),
					type: "server",
					localServerId: this.serverId,
					clientId: this.clientInfo.Id
				}
				setCollectItem(data);
				this.checkIsCollect();
			},
			init(){
				this.loadData();
			},
			startGetData() {
				this.timeOut = setTimeout(() => {
					this.init();
					this.startGetData();
				}, timeOutTimes);
			},
			stopGetData() {
				console.log("stopGetData clientInfo")
				if (this.timeOut) {
					clearTimeout(this.timeOut);
				}
			},
			loadData(load) {
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
						this.checkIsCollect();
					})
					.catch(error => {
						if (load) uni.hideLoading();
						this.$showError(error);
					});
			},
			formatRate(bytes) {
				let res = formatBytes(bytes);
				if (res.fileSize == 0) return 0 + 'B';
			
				return res.fileSize + res.unit;
			},
			formatBytesToStr(bytes) {
				let res = formatBytes(bytes);
				return res.fileSize + res.unit;
			}
		}
	}
</script>

<style scoped>
	
</style>