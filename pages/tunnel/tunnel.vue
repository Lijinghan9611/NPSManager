<template>
	<view>
		<BaseBox>
			<uni-forms class="form" ref="form" :modelValue="formData" :rules="rules" label-width="auto" label-position="top">
				<uni-forms-item label="模式" name="type">
					<uni-data-select
					        v-model="formData.type"
					        :localdata="typeSelect"
					      ></uni-data-select>
				</uni-forms-item>
				
				<uni-forms-item label="备注" name="remark"><BaseFormInput v-model="formData.remark" placeholder="备注"></BaseFormInput></uni-forms-item>
				<uni-forms-item label="服务端端口" name="port">
					<BaseFormInput v-model="formData.port" placeholder="如8024"></BaseFormInput>
				</uni-forms-item>
				<uni-forms-item label="目标 (IP:端口)" name="target" v-if="formData.type != 'httpProxy' && formData.type != 'socks5'">
					<BaseFormInput type="textarea" v-model="formData.target" placeholder="回车换行"></BaseFormInput>
					<BaseText><text style="color:gray">代理到本地可以只填写端口号，只有TCP模式支持负载均衡</text></BaseText>
				</uni-forms-item>
				
				<uni-forms-item label="唯一标识密钥" name="password" v-if="formData.type == 'secret' || formData.type == 'p2p'">
					<BaseFormInput v-model="formData.password" placeholder="P2P连接和私密代理模式需要"></BaseFormInput>
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
import { PostAddTunnel,
	PostEditTunnel } from '@/api/api.js';
export default {
	data() {
		return {
			serverId: '',
			clientId: '',
			id: '',
			rules: {},
			formData: {
				remark: '',
				password: '',
				port:"",
				target:"",
				type:"",
			},
			typeSelect: [
				{
					text: 'TCP 隧道',
					value: 'tcp'
				},
				{
					text: 'UDP 隧道',
					value: 'udp'
				},
				{
					text: 'HTTP 代理',
					value: 'httpProxy'
				},
				{
					text: 'SOCKS 代理',
					value: 'socks5'
				},
				{
					text: '私密代理',
					value: 'secret'
				},
				 {
				 	text: 'P2P 连接',
				 	value: 'p2p'
				 },
			]
		};
	},
	onLoad(opt) {
		this.serverId = this.$store.state.currentServer.id;
		this.clientId = opt.clientId;
		
		if (opt.data) {
			uni.setNavigationBarTitle({
				title: '修改隧道记录'
			});
			this.loadData(opt.data);
		} else {
			if(opt.tunnelType && opt.tunnelType != ''){
				this.formData.type = opt.tunnelType
			}
			uni.setNavigationBarTitle({
				title: '添加隧道记录'
			});
		}
	},
	methods: {
		loadData(item) {
			let data = JSON.parse(item);
			console.log(data)
			this.id = data.Id;
			this.formData.remark = data.Remark;
		 
			this.formData.type = data.Mode;
			this.formData.target = data.Target?.TargetStr;
			this.formData.port = data.Port;
			this.formData.password = data.Password;
			
			this.formData.client_id = this.clientId;
		},
		submitForm() {
			this.$refs.form
				.validate()
				.then(res => {
					let data = { ...res };
					let fun = PostAddTunnel;
					console.log(this.id)
						
					if (this.id && this.id != '') {
						data.id = this.id;
						fun = PostEditTunnel;
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
