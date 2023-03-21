<template>
	<view>
		<BaseBox>
			<uni-forms class="form" ref="form" :modelValue="formData" :rules="rules" label-width="80px">
				<!-- <uni-forms-item label="链接方式" name="conn">
					<PickerText :text="formData.name" @click="selectUser" :readonly="readonly"></PickerText>
				</uni-forms-item>
				<uni-forms-item label="$t('common.name')" name="name">
					<BaseFormInput v-model="formData.name" :preview="readonly" placeholder="$t('btn.pleaseEnter')"></BaseFormInput>
				</uni-forms-item> -->
			</uni-forms>
		</BaseBox>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				name: ''
			},
			rules: {
				name: {
					rules: [
						{
							required: true,
							errorMessage: '不能为空'
						}
					]
				}
			}
		};
	},
	computed: {},
	methods: {
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .uni-list--border:after {
	position: static;
}
</style>
