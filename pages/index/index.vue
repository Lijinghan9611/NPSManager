<template>
	<view>
		<BaseBox v-for="(item, index) in ServerList" :key="item.id" hover @longpress="delItem(item)"
			@click="goDetail(item)">
			<uni-title type="h3" class="underline" :title="item.name" align="left"></uni-title>
			<view>
				<BaseText title="链接">{{item.url}}</BaseText>
				<BaseText title="秘钥">{{item.authKey}}</BaseText>
			</view>
			<view style="text-align: right;">
				<button size="mini" type="primary" @click.stop="edit(item)">编辑</button>
			</view>
		</BaseBox>

		<view class="center" style="margin-top: 10px;">
			<button size="mini" type="primary" @click="show">添加</button>
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

	</view>
</template>

<script>
	import {
		getServers,
		delServerItem,
		setServerItem
	} from "@/utils/common.js";

	export default {
		data() {
			return {
				ServerList: [],
				menuList: [],
				editId: "",
				showForm: false,
			};
		},
		onLoad() {
			this.getData();
		},
		methods: {
			edit(item) {
				this.editId = item.id;
				this.showForm = true;
				this.$refs.popupForm.open();
			},
			getData() {
				let list = getServers();
				console.log(list);
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
				uni.navigateTo({
					url: "/pages/ServerInfo/ServerInfo?id=" + item.id
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
	}


	::v-deep .pop-form .uni-popup__wrapper {
		width: 80%; //弹出宽度
	}

	.title-content {
		position: relative;

		.close-btn {
			position: absolute;
			right: 10px;
			top: 12px;
		}
	}
</style>
