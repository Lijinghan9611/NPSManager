<template>
	<view>
		<BaseBox>
			<uni-forms class="form" ref="form" :modelValue="formData" :rules="rules" label-width="80px">
				<uni-forms-item required label="名称:" name="name">
					<BaseFormInput v-model="formData.name" placeholder="请输入"></BaseFormInput>
				</uni-forms-item>
				
				<uni-forms-item required label="链接:" name="url">
					<BaseFormInput v-model="formData.url" placeholder="请输入"></BaseFormInput>
				</uni-forms-item>
				
				<uni-forms-item required label="秘钥:" name="authKey">
					<BaseFormInput v-model="formData.authKey" placeholder="请输入"></BaseFormInput>
				</uni-forms-item>
				
				<uni-forms-item label="是否直连:" name="connectType">
					<uni-data-checkbox mode="button" v-model="formData.connectType" :localdata="connList" />
				</uni-forms-item>
				
				<view class="btn-area flex">
					<view class="flex-1">
						<button class="medium-btn" @click="close()">取消</button>
					</view>
					<view class="flex-1">
						<button class="medium-btn" type="primary" @click="submit()">保存</button>
					</view>
				</view>
			</uni-forms>
		</BaseBox>
	</view>
</template>

<script>
	
import {setServerItem, getServerItem} from "@/utils/common.js";
export default {
	props: {
		id :{
			type:String,
			default :""
		}
	},
	emits: ['update:modelValue', 'close'],
	components: {},
	data() {
		return {
			rules: {
				name: {
					rules: [
						{
							required: true,
							errorMessage: '请输入名称'
						}
					]
				},
				url: {
					rules: [
						{
							required: true,
							errorMessage: '请输入链接'
						}
					]
				},
				code: {
					rules: [
						{
							required: true,
							errorMessage: '请输入接口秘钥'
						}
					]
				}
			},
			formData: {
				id:"",
				name: '',
				url:"",
				authKey:"",
				connectType: 1
			},
			connList: [
				{
					text: '是',
					value: 1
				},
				{
					text: '否',
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
		if(this.isEdit){
			this.getData();
		}
	},
	methods: {
		getData(){
			let item = getServerItem(this.id);
			if(item){
				for(var key in item){	//复制赋值
					this.formData[key] = item[key];
				}
			}
		},
		submit() {
			this.$refs.form.validate()
			.then(res => {
				if(!this.isEdit){
					res.id = new Date().getTime() + "";
				}
				else
					res.id = this.id;
				console.log(res);
				setServerItem(res);
				this.close();
			}).catch(err => {
				console.error(err);
				uni.showToast({
					icon:"error",
					title:"請按要求填写內容",
					position :"bottom"
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

::v-deep .uni-data-checklist{
	display: flex;
	width: 100%;
}


::v-deep .input {
	width: 100%;
}

::v-deep .uni-easyinput{
	top:2px;
}

::v-deep .form .uni-easyinput__content-textarea{
	padding-left: 0;
}
</style>
