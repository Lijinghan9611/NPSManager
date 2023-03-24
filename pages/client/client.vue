<template>
	<view>
		<BaseBox>
			<uni-forms class="form" ref="form" :modelValue="formData" :rules="rules" label-width="auto" label-position="top">
				<uni-forms-item label="备注" name="remark"><BaseFormInput v-model="formData.remark" placeholder="备注"></BaseFormInput></uni-forms-item>
				<uni-forms-item label="Basic 认证用户名" name="u">
					<BaseFormInput v-model="formData.u" placeholder="留空时表示不受限制"></BaseFormInput>
					<BaseText><text style="color:gray">仅限Socks5、Web、HTTP转发代理</text></BaseText>
				</uni-forms-item>
				<uni-forms-item label="Basic 认证密码" name="p">
					<BaseFormInput v-model="formData.p" placeholder="留空时表示不受限制"></BaseFormInput>
					<BaseText><text style="color:gray">仅限Socks5、Web、HTTP转发代理</text></BaseText>
				</uni-forms-item>
				<uni-forms-item label="唯一验证密钥" name="vkey">
					<BaseFormInput v-model="formData.vkey" placeholder="留空时表示不受限制"></BaseFormInput>
					<BaseText><text style="color:gray">唯一值，不填将自动生成</text></BaseText>
				</uni-forms-item>

				<uni-forms-item label="允许客户端通过配置文件连接" name="config_conn_allow">
					<uni-data-checkbox mode="button" v-model="formData.config_conn_allow" :localdata="selectList"></uni-data-checkbox>
				</uni-forms-item>

				<uni-forms-item label="压缩" name="compress">
					<uni-data-checkbox mode="button" v-model="formData.compress" :localdata="selectList"></uni-data-checkbox>
				</uni-forms-item>

				<uni-forms-item label="加密" name="crypt"><uni-data-checkbox mode="button" v-model="formData.crypt" :localdata="selectList"></uni-data-checkbox></uni-forms-item>

				<uni-forms-item label="带宽限制" name="rate_limit">
					<BaseFormInput type="Number" v-model="formData.rate_limit" placeholder="单位KB/S 空则为不限制"></BaseFormInput>
				</uni-forms-item>

				<uni-forms-item label="流量限制" name="flow_limit">
					<BaseFormInput type="Number" v-model="formData.flow_limit" placeholder="单位M 空则为不限制"></BaseFormInput>
				</uni-forms-item>

				<uni-forms-item label="客户端最大连接数量 " name="max_conn">
					<BaseFormInput type="Number" v-model="formData.max_conn" placeholder="空则为不限制"></BaseFormInput>
				</uni-forms-item>

				<uni-forms-item label="客户端最大隧道数量 " name="max_tunnel">
					<BaseFormInput type="Number" v-model="formData.max_tunnel" placeholder="空则为不限制"></BaseFormInput>
				</uni-forms-item>
			</uni-forms>
		</BaseBox>

		<view style="height: 100px;"></view>
		<view class="bottom-area">
			<view class="btn-area">
				<view class="btns"><button type="default" class="btn-primary" hover-class="btn-hover" @click="submitForm()">保 存</button></view>
			</view>
		</view>
	</view>
</template>

<script>
import { PostAddClient,
	PostEditClient, GetClient } from '@/api/api.js';
export default {
	data() {
		return {
			serverId: '',
			id: '',
			rules: {
				check: {
					rules: [
						{
							required: true,
							errorMessage: '请输入备注'
						}
					]
				}
			},
			formData: {
				remark: '',
				u: '',
				p: '',
				vkey: '',
				config_conn_allow: 1,
				crypt: 0,
				compress: 0,
				rate_limit: '',
				flow_limit: '',
				max_conn: '',
				max_tunnel: ''
			},
			selectList: [
				{
					text: '是',
					value: 1
				},
				{
					text: '否',
					value: 0
				}
			]
		};
	},
	onLoad(opt) {
		this.serverId = this.$store.state.currentServer.id;
		if (opt.id) {
			this.id = opt.id;
			uni.setNavigationBarTitle({
				title: '修改客户端'
			});
			this.loadData(1);
		} else {
			uni.setNavigationBarTitle({
				title: '添加客户端'
			});
		}
	},
	methods: {
		loadData(load) {
			if (load)
				uni.showLoading({
					title: '加载中，请稍候...'
				});
			GetClient(this.serverId, {
				id: this.id
			})
				.then(res => {
					if (load) uni.hideLoading();
					console.log(res);
					this.formData.remark = res.data.Remark;
					this.formData.u = res.data.Cnf.U;
					this.formData.p = res.data.Cnf.P;
					this.formData.vkey = res.data.VerifyKey;

					this.formData.config_conn_allow = res.data.ConfigConnAllow ? 1 : 0;
					this.formData.crypt = res.data.Cnf.Crypt ? 1 : 0;
					this.formData.compress = res.data.Cnf.Compress ? 1 : 0;

					this.formData.rate_limit = res.data.RateLimit;
					this.formData.flow_limit = res.data.Flow.FlowLimit;
					this.formData.max_conn = res.data.MaxConn;
					this.formData.max_tunnel = res.data.MaxTunnelNum;
				})
				.catch(error => {
					if (load) uni.hideLoading();
					this.$showError(error);
				});
		},
		submitForm() {
			this.$refs.form
				.validate()
				.then(res => {
					console.log(res);
					let data = { ...res };
					let fun = PostAddClient;
					if (this.id && this.id != '') {
						data.id = this.id;
						fun = PostEditClient;
					}

					uni.showLoading({
						title: '提交中，请稍候...'
					});
					fun(this.serverId, data)
						.then(res => {
							console.log(res);
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
