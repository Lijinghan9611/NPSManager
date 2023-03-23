<template>
	<view>
		<BaseBox @click="editItem(item)" hover v-for="item in list" :key="item.Id">
			<view class="flex flex-align-items"><uni-title type="h4" :title="item.Host" align="left"></uni-title></view>
			<BaseText title="备注">{{ item.Remark }}</BaseText>
			<view class="flex">
				<view class="flex-1">
					<BaseText title="模式">{{ item.Scheme }}</BaseText>
				</view>
				<view class="flex-1">
					<BaseText title="目标 (IP:端口)">{{ item.Target?.TargetStr }}</BaseText>
				</view>
			</view>
			<BaseText title="位置">{{ item.Location }}</BaseText>

			<view @click.stop style="text-align: right; margin-top: 10px;"><button type="warn" @click.stop="delHost(item)" size="mini">删除</button></view>
		</BaseBox>

		<view class="base-padding"><uni-pagination v-if="foundData" :pageSize="pageSize" :total="total" :show-icon="true" @change="change" /></view>

		<not-found :show="!foundData" :text="loaddingText"></not-found>

		<view style="height: 100px;"></view>
		<uni-fab :popMenu="false" @fabClick="editItem()" horizontal="right"></uni-fab>
	</view>
</template>

<script>
import { GetHostList, PostDelHost } from '@/api/api.js';
import { formatDate, formatBytes } from '@/utils/common.js';

export default {
	props: {
		id: String,
		type: String,
		serverId:String,
	},
	data() {
		return {
			loaddingText: '正在加载，请稍后...',
			loadStatus: ['more', 'loading', 'noMore'],
			loadStatu: 0,
			foundData: true,
			ReachBottom: false,

			list: {},
			search: '',
			page: 0,
			pageSize: 5, //this.$pageSize,
			total: 0
		};
	},
	created() {
		this.loadData();
	},
	watch: {
		type(newal) {
			this.page = 0;
			this.loadData();
		}
	},
	methods: {
		editItem(item) {
			if(item){
				uni.navigateTo({
					url: '/pages/host/host?clientId=' + this.id + "&data=" + JSON.stringify(item)
				});
			}
			else{
				uni.navigateTo({
					url: '/pages/host/host?clientId=' + this.id
				});
			}
			
		},
		delHost(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除域名解析记录吗？',
				success: res => {
					if (res.confirm) {
						PostDelHost(this.serverId, {
							id: item.Id
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
		change(res) {
			this.page = res.current - 1;
			this.loadData();
		},
		loadData() {
			//tcp udp httpProx socks5 secret p2p
			let offset = this.pageSize * this.page;
			GetHostList(this.serverId, {
				client_id: this.id,
				search: this.search,
				offset: offset,
				limit: this.pageSize
			})
				.then(res => {
					console.log(res);
					this.list = res.rows;
					this.loaddingText = '没有找到数据';
					this.foundData = true;
					this.total = res.total;
					if (res.total == 0) this.foundData = false;
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
