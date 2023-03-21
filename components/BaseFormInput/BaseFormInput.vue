<template>
	<view class="flex-1 flex flex-align-items" :class="{ input: !preview }">
		<uni-easyinput :input-border="false" v-if="!preview" v-bind="$attrs" v-model="innerValue" />
		<view v-else class="read-text">{{ modelValue }}</view>
	</view>
</template>

<script>
export default {
	name: 'form-input',
	props: {
		value: [String, Number],
		modelValue: [Number, String],
		preview: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			innerValue: this.modelValue
		};
	},
	watch: {
		value(newVal) {
			this.innerValue = newVal;
		},
		modelValue(newVal) {
			this.innerValue = newVal;
		},
		innerValue(newVal) {
			this.$emit('update:value', newVal);
			this.$emit('update:modelValue', newVal);
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .uni-textarea-placeholder {
	font-size: $uni-font-size-xs;
}

</style>
