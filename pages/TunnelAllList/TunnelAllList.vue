<template>
	<view>
		<BaseBox>
			<view class="flex flex-align-items underline">
				<uni-title type="h4" :title="clientInfo.Remark" align="left"></uni-title>
				<view class="rate-text flex-1">{{ formatRate(clientInfo.Rate?.NowRate) + '/s' }}</view>
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
			<BaseText title="验证密钥">{{ clientInfo.VerifyKey }}</BaseText>
			<BaseText title="客户端地址">{{ clientInfo.Addr }}</BaseText>
		</BaseBox>
	</view>
</template>

<script>
import { GetClient } from '@/api/api.js';
import { getServerItem, formatDate, formatBytes } from '@/utils/common.js';
import { timeOutTimes } from '@/config/options.js';
export default {
	data() {
		return {
			serverId: '',
			clientId: '',
			clientInfo: {}
		};
	},
	onLoad(opt) {
		this.serverId = this.$store.state.currentServer.id;
		this.clientId = opt.id;

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
		init(load) {
			this.loadData(load);
			this.startGetData();
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
				})
				.catch(error => {
					if (load) uni.hideLoading();
					this.$showError(error);
				});
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
