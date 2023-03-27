<template>
	<view>
		<BaseBox>
			<uni-forms class="form" ref="form" :modelValue="formData" :rules="rules" label-width="80px">

				<view v-show="!IsImport">

					<uni-forms-item required label="名称:" name="name">
						<BaseFormInput v-model="formData.name" placeholder="请输入"></BaseFormInput>
					</uni-forms-item>

					<uni-forms-item required label="链接:" name="url">
						<BaseFormInput v-model="formData.url" placeholder="请输入"></BaseFormInput>
					</uni-forms-item>

					<uni-forms-item required label="秘钥:" name="authKey">
						<BaseFormInput v-model="formData.authKey" placeholder="请输入"></BaseFormInput>
					</uni-forms-item>

					<!-- #ifndef MP-WEIXIN -->
					<uni-forms-item label="连接方式:" name="connectType">
						<uni-data-checkbox mode="button" v-model="formData.connectType" :localdata="connList" />
					</uni-forms-item>
					<view style="position: relative; top:-10px;color: red;text-align: left;">
						服务器数据仅存放到本地，选择代理时，数据通过服务器转发，适用于小程序等</view>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<view style="position: relative; top:-10px;color: red;text-align: left;">
						服务器数据仅存放到本地，小程序数据仅能通过代理服务器访问，代理服务器仅转发，不存放任何数据</view>
					<!-- #endif -->
				</view>

				<view v-if="IsImport">
					<uni-forms-item required label="配置:" name="url">
						<BaseFormInput type="textarea" v-model="configs" placeholder="请输入"></BaseFormInput>
					</uni-forms-item>
				</view>
				<view class="btn-area flex">
					<view class="flex-1">
						<button class="medium-btn" @click="close()">取消</button>
					</view>
					<view class="flex-1">
						<button class="medium-btn btn-primary" type="default" hover-class="btn-hover"
							@click="submit()">保存</button>
					</view>
				</view>
				<view v-if="!isEdit" style="padding-top: 20px;">
					<text class="link" @click="IsImport = !IsImport">{{IsImport ? "返回" : "批量导入"}}</text>
				</view>
			</uni-forms>
		</BaseBox>
	</view>
</template>

<script>
	import {
		setServerItem,
		getServerItem,
		setCollectItem,
		getCollectItem
	} from "@/utils/common.js";
	import MD5 from 'crypto-js/md5';
	export default {
		props: {
			id: {
				type: String,
				default: ""
			}
		},
		emits: ['update:modelValue', 'close'],
		components: {},
		data() {
			return {
				configs: "",
				IsImport: false,
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入名称'
						}]
					},
					url: {
						rules: [{
							required: true,
							errorMessage: '请输入链接'
						}]
					},
					code: {
						rules: [{
							required: true,
							errorMessage: '请输入接口秘钥'
						}]
					}
				},
				formData: {
					id: "",
					name: '',
					url: "",
					authKey: "",
					connectType: 2,
					password: ""
				},
				connList: [{
						text: '直连',
						value: 1
					},
					{
						text: '代理',
						value: 2
					}
				]
			};
		},
		computed: {
			isEdit() {
				return this.id != "";
			}
		},
		created() {
			if (this.isEdit) {
				this.getData();
			}
		},
		methods: {
			showImport() {
				this.IsImport = true;
			},
			getData() {
				let item = getServerItem(this.id);
				if (item) {
					for (var key in item) { //复制赋值
						this.formData[key] = item[key];
					}
				}
			},
			importData(){
				if(this.configs == ""){
					uni.showToast({
						icon: "error",
						title: "請按要求填写內容",
						position: "bottom"
					});
					return;
				}
				
				try{
					let configData = JSON.parse(this.configs);
					let hasChange = false;
					if(configData.servers){
						configData.servers.forEach(a => {
							if(a.id && a.id != ''){
								let item = getServerItem(a.id);
								if (!item) {
									hasChange = true;
									setServerItem(a);
								}
							}
							else{
								a.id = new Date().getTime() + "";
								hasChange = true;
								setServerItem(a);
							}
						});
					}
					
					if(configData.collects){
						configData.collects.forEach(a => {
							if(a.id && a.id != ''){
								let item = getCollectItem(a.id);
								if (!item) {
									hasChange = true;
									setCollectItem(a);
								}
							}
							else{
								a.id = new Date().getTime() + "";
								hasChange = true;
								setCollectItem(a);
							}
						});
					}
					
					if(hasChange){
						uni.showToast({
							icon: "success",
							title: "保存成功",
							position: "bottom"
						});
						this.close();
					}
					else{
						uni.showToast({
							icon: "success",
							title: "数据没有发生改变",
							position: "bottom"
						});
					}
				}catch(e){
					uni.showToast({
						icon: "error",
						title: "配置文件有误",
						position: "bottom"
					});
					//TODO handle the exception
				}
			},
			submit() {
				if(this.IsImport){
					this.importData();
					return;
				}
				this.$refs.form.validate()
					.then(res => {
						if (!this.isEdit) {
							res.id = new Date().getTime() + "";
						} else
							res.id = this.id;

						if (res.password && res.password.length != "" && res.password.length != 32) {
							res.password = MD5(res.password).toString()
						}

						console.log(res);
						setServerItem(res);
						this.close();
					}).catch(err => {
						console.error(err);
						uni.showToast({
							icon: "error",
							title: "請按要求填写內容",
							position: "bottom"
						});
					})
			},
			close() {
				this.$emit('close');
			}
		}
	};
</script>

<style scoped lang="scss">
	.btn-area {
		margin-top: $spacing-col-base;
	}

	.medium-btn {
		margin: 0 10%;
	}

	::v-deep .uni-data-checklist {
		display: flex;
		width: 100%;
	}


	::v-deep .input {
		width: 100%;
	}

	::v-deep .uni-easyinput {
		top: 2px;
	}

	::v-deep .form .uni-easyinput__content-textarea {
		padding-left: 0;
	}
</style>