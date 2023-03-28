<template>
	<view>
		<BaseBox @click="click" :hover="isShow">
			<view class="flex flex-align-items underline">
				<image src="/static/images/icon-server.png" class="item-icon"></image>
				<uni-title type="h3" class="flex-1" :title="localServerData.name" align="left"></uni-title>
			</view>
			
			<BaseText title="链接">{{ localServerData.url }}</BaseText>

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

			<view style="text-align: right;" v-if="!isShow">
				<button type="default" class="btn-primary" hover-class="btn-hover" style="margin-right: 10px;"
					@click.stop="editItem()" size="mini">编辑</button>
			</view>
		</BaseBox>

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

	</view>
</template>

<script>
	import {
		GetServerTime,
		GetClientList,
		PostDelClient
	} from '@/api/api.js';
	import {
		getServerItem,
		formatDate,
		formatBytes,
		setCollectItem,
		getCollectItem,
		delCollectItem
	} from '@/utils/common.js';

	import {
		timeOutTimes
	} from '@/config/options.js';
	export default {
		name: "Server",
		props: {
			serverId: [String, Number],
			isShow: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				localServerData: {},
				serverTime: '',
				onlineServerData: {
					rows: []
				},
				editId: "",
				showForm: false,
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			click() {
				this.$emit("click")
			},
			close() {
				this.$refs.popupForm.close();
				this.showForm = false;
				this.init();
			},
			editItem() {
				this.editId = this.serverId;
				this.showForm = true;
				this.$refs.popupForm.open();
			},
			init() {
				this.localServerData = getServerItem(this.serverId);
				this.loadData();
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
						if (!res.ip) {
							this.$showError('获取信息失败，请检查配置是否正确');
						}
						console.log(res)
						this.onlineServerData = res;
					})
					.catch(error => {
						if (load) uni.hideLoading();
						this.$showError(error);
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	::v-deep .pop-form .uni-popup__wrapper {
		width: 80%; //弹出宽度
	}

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
	}
</style>