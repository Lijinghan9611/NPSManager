<template>
	<view>
		<ClientInfo :serverId="serverId" :clientId="clientId"></ClientInfo>
		<view class="base-margin">
			<v-tabs :tabs="tabs" pills v-model="current" activeColor="#fff"></v-tabs>
		</view>

		<TunnelList ref="tunnelList" v-if="IsTunnel" :id="clientId" :serverId="serverId" :type="tunnelType"></TunnelList>
		<HostList ref="hostlist" v-else :id="clientId" :serverId="serverId"></HostList>

	 </view>
</template>

<script>
	import {
		timeOutTimes
	} from '@/config/options.js';

	import TunnelList from "./tunnelList.vue"
	import HostList from "./hostList.vue"
	import ClientInfo from "../client/clientInfo.vue"
	export default {
		components: {
			TunnelList,
			HostList,
			ClientInfo
		},
		data() {
			return {
				serverId: '',
				clientId: '',
				current: 0,
				tunnelType: "",
				tabs: ["域名解析", "隧道", "TCP", "UDP", "HTTP代理", "SOCKS5", "私密代理", "P2P"]
			};
		},
		computed: {
			IsTunnel() {
				let keyName = this.tabs[this.current];
				if (keyName == '域名解析') {
					return false;
				}
				return true;
			}
		},
		watch: {
			current(newVal) {
				let keyName = this.tabs[newVal];
				if (keyName == '域名解析') {
					this.tunnelType = "";
				} else if (keyName == '隧道') {
					this.tunnelType = "";
				} else if (keyName == 'TCP') {
					this.tunnelType = "tcp";
				} else if (keyName == 'UDP') {
					this.tunnelType = "udp";
				} else if (keyName == 'HTTP代理') {
					this.tunnelType = "httpProxy";
				} else if (keyName == 'SOCKS5') {
					this.tunnelType = "socks5";
				} else if (keyName == '私密代理') {
					this.tunnelType = "secret";
				} else if (keyName == 'P2P') {
					this.tunnelType = "p2p";
				}
			}
		},
		onLoad(opt) {
			this.serverId = opt.serverId;
			this.clientId = opt.id;
			this.init(1);
		},
		onShow() {
			if(this.isNotFirst){
				this.init();
			}
			this.isNotFirst = true;
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
				if(!load){
					if(this.IsTunnel){
						this.$refs.tunnelList.loadData();
					}
					else{
						this.$refs.hostlist.loadData();
					}
				}
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
		}
	};
</script>

<style lang="scss" scoped>
	.rate-text {
		padding: 0 10px;
		text-align: right;
	}
</style>
