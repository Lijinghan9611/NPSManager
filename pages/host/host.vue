<template>
	<view>
		<BaseBox>
			<uni-forms class="form" ref="form" :modelValue="formData" :rules="rules" label-width="auto" label-position="top">
				<uni-forms-item label="备注" name="remark"><BaseFormInput v-model="formData.remark" placeholder="备注"></BaseFormInput></uni-forms-item>
				<uni-forms-item label="主机" name="host"><BaseFormInput v-model="formData.host" placeholder="如 a.proxy.com"></BaseFormInput></uni-forms-item>
				<uni-forms-item label="模式" name="scheme"><uni-data-checkbox mode="button" v-model="formData.scheme" :localdata="selectList"></uni-data-checkbox></uni-forms-item>

				<uni-forms-item label="URL 路由" name="location"><BaseFormInput v-model="formData.location" placeholder="留空时表示不受限制"></BaseFormInput></uni-forms-item>

				<uni-forms-item label="目标 (IP:端口)" name="target">
					<BaseFormInput type="textarea" v-model="formData.target" placeholder="回车换行"></BaseFormInput>
					<BaseText><text style="color:gray">分行填写多个目标可实现负载均衡</text></BaseText>
				</uni-forms-item>

				<uni-forms-item label="请求头部信息修改" name="header">
					<BaseFormInput type="textarea" v-model="formData.header" placeholder="回车换行"></BaseFormInput>
					<BaseText><text style="color:gray">冒号分割，多个头部请填写多行</text></BaseText>
				</uni-forms-item>

				<uni-forms-item label="请求主机信息修改" name="hostchange">
					<BaseFormInput v-model="formData.hostchange" placeholder="请求主机信息修改"></BaseFormInput>
				</uni-forms-item>
			</uni-forms>
		</BaseBox>

		<view style="height: 100px;"></view>
		<view class="bottom-area">
			<view class="btn-area">
				<view class="btns"><button type="primary" class="base-button" @click="submitForm()">保 存</button></view>
			</view>
		</view>
	</view>
</template>

<script>
import { PostAddHost, PostEditHost } from '@/api/api.js';
export default {
	data() {
		return {
			serverId: '',
			clientId: '',
			id: '',
			rules: {},
			formData: {
				remark: '',
				host: '',
				scheme: 'all',
				location: '',
				client_id: '',
				target: '',
				header: '',
				hostchange: ''
			},
			selectList: [
				{
					text: '所有',
					value: 'all'
				},
				{
					text: 'http',
					value: 'http'
				},
				{
					text: 'https',
					value: 'https'
				}
			]
		};
	},
	onLoad(opt) {
		this.serverId = this.$store.state.currentServer.id;
		this.clientId = opt.clientId;
		if (opt.data) {
			uni.setNavigationBarTitle({
				title: '修改域名解析记录'
			});
			this.loadData(opt.data);
		} else {
			uni.setNavigationBarTitle({
				title: '添加域名解析记录'
			});
		}
	},
	methods: {
		loadData(item) {
			let data = JSON.parse(item);
			console.log(data)
			this.id = data.Id;
			this.formData.remark = data.Remark;
		 
			this.formData.host = data.Host;
			this.formData.scheme = data.Scheme;
			this.formData.location = data.Location;
			this.formData.client_id = this.clientId;
			this.formData.target = data.Target?.TargetStr;
			this.formData.header = data.HeaderChange;
			this.formData.hostchange = data.HostChange;
			// if (load)
			// 	uni.showLoading({
			// 		title: '加载中，请稍候...'
			// 	});
			// GetClient(this.serverId, {
			// 	id: this.id
			// })
			// 	.then(res => {
			// 		if (load) uni.hideLoading();
			// 		console.log(res);
			// 		this.formData.remark = res.data.Remark;
			// 		this.formData.u = res.data.Cnf.U;
			// 		this.formData.p = res.data.Cnf.P;
			// 		this.formData.vkey = res.data.VerifyKey;

			// 		this.formData.config_conn_allow = res.data.ConfigConnAllow ? 1 : 0;
			// 		this.formData.crypt = res.data.Cnf.Crypt ? 1 : 0;
			// 		this.formData.compress = res.data.Cnf.Compress ? 1 : 0;

			// 		this.formData.rate_limit = res.data.RateLimit;
			// 		this.formData.flow_limit = res.data.Flow.FlowLimit;
			// 		this.formData.max_conn = res.data.MaxConn;
			// 		this.formData.max_tunnel = res.data.MaxTunnelNum;
			// 	})
			// 	.catch(error => {
			// 		if (load) uni.hideLoading();
			// 		this.$showError(error);
			// 	});
		},
		submitForm() {
			this.$refs.form
				.validate()
				.then(res => {
					let data = { ...res };
					let fun = PostAddHost;
					console.log(this.id)
					if (this.id && this.id != '') {
						data.id = this.id;
						fun = PostEditHost;
					}
					data.client_id = this.clientId;
					console.log(data);
					uni.showLoading({
						title: '提交中，请稍候...'
					});
					fun(this.serverId, data)
						.then(res => {
							console.log(res)
							uni.hideLoading();
							if(res.status == 1){
								uni.showToast({
									icon: 'success',
									title: '保存成功'
								});
								setTimeout(() => {
									uni.navigateBack();
								}, 800);
							}
							else{
								this.$showError(res);
							}
						})
						.catch(error => {
							uni.hideLoading();
							this.$showError(error);
						});
				})
				.catch(err => {
					uni.showToast({
						icon: 'error',
						title: '請按要求填寫內容'
					});
				});
		}
	}
};
</script>

<style lang="scss">
.bottom-area {
	position: fixed;
	background-color: #fff;
	border-top: 1px solid #eee;
	bottom: 0px;
	width: 100%;

	.btn-area {
		display: flex;

		.btns {
			flex: 1;
			padding: $spacing-col-small;
		}
	}

	//ipad等大屏端
	@media (min-width: 700px) {
		.btn-area {
			justify-content: flex-end;
			.btns {
				flex: unset;
			}
		}
	}
}
</style>
