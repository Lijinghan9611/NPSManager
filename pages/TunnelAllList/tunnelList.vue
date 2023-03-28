<template>
	<view>
		<view><uni-search-bar @confirm="startSearch" v-model="search" @cancel="startSearch(1)" @clear="startSearch(1)" />
		</view>
		
		<BaseBox @click="editItem(item)" v-for="item in list" :key="item.Id">
			<view class="flex flex-align-items">
				<image src="/static/images/icon-tunnel.png" class="item-icon"></image>
				<uni-title type="h4" :title="item.Remark?item.Remark : ' '" align="left"></uni-title>

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

			<view @click.stop style="text-align: right;margin-top: 10px;">
				<button type="default" class="btn-primary" hover-class="btn-hover" v-if="!item.IsCollect" style="margin-right: 10px;" @click.stop="CollectItem(item)" size="mini">收藏</button>
				<button @click.stop="cancelCollectItem(item)" v-else style="margin-right: 10px;" size="mini">取消收藏</button>
				
				<button type="warn" style="margin-right: 10px;" @click.stop="delTunnel(item)" size="mini">删除</button>
				<button type="warn" @click.stop="stopTunnel(item)" size="mini" v-if="item.Status">停止</button>
				<button type="default" class="btn-primary" hover-class="btn-hover" @click.stop="startTunnel(item)" size="mini" v-else>启动</button>
			</view>
		</BaseBox>

		<view class="base-padding">
			<uni-pagination v-if="foundData" :current="current" :pageSize="pageSize" :total="total" :show-icon="true"
				@change="change" />
		</view>

		<not-found :show="!foundData" :text="loaddingText"></not-found>
		
		<uni-fab :popMenu="false" @fabClick="editItem()" horizontal="right"></uni-fab>
	</view>
</template>

<script>
	import {
		GetTunnelList,
		PostStartTunnel,
		PostStopTunnel,
		PostDelTunnel
	} from '@/api/api.js';
	import {
		formatDate,
		formatBytes,
		setCollectItem, getCollectItem, delCollectItem 
	} from '@/utils/common.js';

	export default {
		props: {
			id: String,
			type: String,
			serverId:String,
		},
		data() {
			return {
				loaddingText: '正在加载，请稍后...',
				loadStatus: ["more", "loading", "noMore"],
				loadStatu: 0,
				foundData: true,
				ReachBottom: false,
				current: 0,
				list: {},
				search: "",
				page: 0,
				pageSize: this.$pageSize,
				total: 0,
				TunnelList: []
			};
		},
		created() {
			this.loadData();
		},
		watch: {
			type(newal) {
				this.current = 1;
				this.page = 0;
				this.loadData();
			}
		},
		methods: {
			startSearch(type) {
				if(type === 1)
					this.search = ""
				this.page = 0;
				this.loadData();
			},
			checkIsCollect(item){
				let checkItem = getCollectItem("tunnel-" + this.serverId + "-" + this.id + "-" + item.Id);
				if(!checkItem)
					item.IsCollect = false;
				else 
					item.IsCollect = true;
			},
			cancelCollectItem(item){
				delCollectItem("tunnel-" + this.serverId + "-" + this.id + "-" + item.Id);
				this.checkIsCollect(item);
			},
			CollectItem(item){
				let data = {
					id : "tunnel-" + this.serverId + "-" + this.id + "-" + item.Id,
					data : JSON.stringify(this.clientInfo),
					type: "tunnel",
					localServerId: this.serverId,
					clientId: this.id ,
					tunnelId:item.Id
				}
				setCollectItem(data);
				this.checkIsCollect(item);
			},
			editItem(item) {
				if(item){
					uni.navigateTo({
						url: '/pages/tunnel/tunnel?clientId=' + this.id + "&tunnelType=" + this.type + "&data=" + JSON.stringify(item)
					});
				}
				else{
					uni.navigateTo({
						url: '/pages/tunnel/tunnel?clientId=' + this.id + "&tunnelType=" + this.type
					});
				}
				
			},
			delTunnel(item) {
				uni.showModal({
					title: '提示',
					content: '确定要删除隧道吗？',
					success: res => {
						if (res.confirm) {

							PostDelTunnel(this.serverId, {
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
			stopTunnel(item) {
				uni.showModal({
					title: '提示',
					content: '确定要停止隧道吗？',
					success: res => {
						if (res.confirm) {

							PostStopTunnel(this.serverId, {
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
			startTunnel(item) {
				uni.showModal({
					title: '提示',
					content: '确定要启动隧道吗？',
					success: res => {
						if (res.confirm) {

							PostStartTunnel(this.serverId, {
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
			change(res) {
				this.page = res.current - 1;
				this.loadData();
			},
			loadData() {
				//tcp udp httpProx socks5 secret p2p
				let offset = this.pageSize * (this.page)
				GetTunnelList(this.serverId, {
						client_id: this.id,
						type: this.type,
						search: this.search,
						offset: offset,
						limit: this.pageSize
					})
					.then(res => {
						console.log(res);
						
						res.rows.forEach(a => {
							this.checkIsCollect(a);
						})
						this.list = res.rows;
						this.loaddingText = "没有找到数据"
						this.foundData = true;
						this.total = res.total;
						if (res.total == 0)
							this.foundData = false;
					})
					.catch(error => {
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
	};
</script>

<style lang="scss" scoped>
	.rate-text {
		padding: 0 10px;
		text-align: right;
	}
</style>
