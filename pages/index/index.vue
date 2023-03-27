<template>
	<view>
		<Server isShow :serverId="item.id" v-for="(item, index) in ServerList" :key="item.id" hover @longpress="delItem(item)"
			@click="goDetail(item)"></Server>

		<view class="center" style="margin-top: 10px;">
			<button size="mini" type="default"  hover-class="btn-hover" @click="copyConfig">复制配置文件</button>
			<button size="mini" type="default" style="margin-left: 10px;" class="btn-primary" hover-class="btn-hover" @click="show">添加服务器</button>
		</view>

		<uni-popup-fix :is-mask-click="false" class="pop-form" ref="popupForm" type="center">
			<view class="pop-content-form">
				<view class="content-inner">
					<view class="title-content">
						<uni-title class="title" type="h4" title="添加服务器" align="canter"></uni-title>
						<text class="close-btn" @click="close">关闭</text>
					</view>
					<AddServer :id="editId" v-if="showForm" @close="close"></AddServer>
				</view>
			</view>
		</uni-popup-fix>
		
		
		<view v-if="collectList.length > 0">
			<view class="base-margin-lr">
				<uni-title type="h3"  title="收藏快捷" align="left"></uni-title>
			</view>
			
			<view v-for="(item, index) in collectList" :key="item.id">
				<ClientInfo @updateCollect="updateCollect" isShow v-if="item.type == 'server'" :clientId='item.clientId' :serverId="item.localServerId" :collectId="item.id"></ClientInfo>
				<TunnelInfo @updateCollect="updateCollect" isShow v-if="item.type == 'tunnel'" :clientId='item.clientId' :serverId="item.localServerId" :tunnelId="item.tunnelId" :collectId="item.id"></TunnelInfo>
			</view>
		</view>
		
		<view style="height: 50px;"></view>
		<view @click="showDes" class="description base-margin" :class="{'des-fixd' : collectList.length == 0}">
			<view class="des-text link">使用说明</view>
		</view>
		
		<uni-popup-fix class="pop-form" ref="popupDesc" type="center">
			<view class="pop-content-form">
				<view class="content-inner">
					<view class="title-content">
						<uni-title class="title" type="h4" title="使用说明" align="canter"></uni-title>
						<text class="close-btn" @click="closeDesc">关闭</text>
					</view>
					<view class="content">
						<BaseBox>
							<view>
								1、添加服务器，填写链接和秘钥，数据仅存放在本地。
							</view>
							<view>
								2、通过转发服务器访问时，中间不存放任何数据。
							</view>
							<view>
								3、本程序代码全开源，具体可在github搜索NPSManager或<text class="link" @click="copy">复制链接</text>
								到浏览器打开。						
							</view>
						</BaseBox>
					</view>
				</view>
			</view>
		</uni-popup-fix>
		
	</view>
</template>

<script>
	import {
		getServers,
		delServerItem,
		setServerItem,
		getCollects
	} from "@/utils/common.js";

	import ClientInfo from "/pages/client/clientInfo.vue"
	import TunnelInfo from "/pages//tunnel/tunnelInfo.vue"
	import Server from "../ServerInfo/Server.vue"
	export default {
		components:{
			ClientInfo,
			TunnelInfo,
			Server
		},
		data() {
			return {
				ServerList: [],
				menuList: [],
				editId: "",
				showForm: false,
				collectList:[]
			};
		},
		onLoad() {
			this.getData();
		},
		onShow() {
			this.init();
		},
		methods: {
			copyConfig(){
				let data = {
					servers:getServers(),
					collects:getCollects()
				}
				
				let copyValue = JSON.stringify(data);
				uni.setClipboardData({
					data: copyValue,
					success: function () {
						uni.showToast({
							icon:'success',
							title:"复制成功"
						})
					}
				});
			},
			copy(){
				uni.setClipboardData({
					data: 'https://github.com/Lijinghan9611/NPSManager',
					success: function () {
						uni.showToast({
							icon:'success',
							title:"复制成功"
						})
					}
				});
			},
			closeDesc(){
				this.$refs.popupDesc.close();
			},
			showDes(){
				this.$refs.popupDesc.open();
			},
			updateCollect(){
				this.init();
			},
			init(){
				this.collectList = getCollects();
			},
			getData() {
				let list = getServers();
				this.init();
				this.ServerList = list;
			},
			close() {
				this.$refs.popupForm.close();
				this.showForm = false;
				this.getData();
			},
			show() {
				this.showForm = true;
				this.editId = "";
				this.$refs.popupForm.open();
			},
			goDetail(item) {
				this.$store.commit("SET_CurrentServer", item);
				uni.navigateTo({
					url: "/pages/ServerInfo/ServerInfo"
				})
			},
			delItem(item) {
				this.IsLongtap = true;
				uni.showActionSheet({
					itemList: ["删除"],
					itemColor: '#FF0000', //App-iOS、字节跳动小程序不支持
					success: res => {
						this.IsLongtap = false;
						if (res.tapIndex == 0) {
							uni.showModal({
								title: "提示",
								content: "确定要删除吗？删除后不可恢复",
								confirmText: "删除",
								confirmColor: '#FF0000',
								success: res1 => {
									if (res1.confirm) {
										this.delItemNow(item);
									}
								}
							});
						}
					},
					fail: err => {
						this.IsLongtap = false;
					}
				});
			},
			delItemNow(item) {
				console.log(item);
				delServerItem(item.id);
				uni.showToast({
					icon: "success",
					title: "删除成功",
					position: "bottom"
				});
				this.getData();
			}
		}
	};
</script>

<style lang="scss">
	.content-inner {
		background-color: $uni-bg-color;
		padding-bottom: $spacing-col-base;
		border-radius: $uni-border-radius-base;

		.title {
			background-color: #fff;
			border-top-left-radius: $uni-border-radius-base;
			border-top-right-radius: $uni-border-radius-base;
		}
		
		.title-content {
			position: relative;
		
			.close-btn {
				position: absolute;
				right: 10px;
				top: 12px;
			}
		}
		
		.content{
			text-align: left;
		}
	}


	::v-deep .pop-form .uni-popup__wrapper {
		width: 80%; //弹出宽度
	}

	
	.description {
		background-color: #fff;
		margin-bottom: 20px;
		& .des-text {
			padding: $spacing-col-mini $spacing-col-base;
		}
	}
	
	.des-fixd{
		position: fixed;
		bottom: 0;
		left: 0%;
	}
</style>
