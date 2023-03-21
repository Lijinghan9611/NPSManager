<template>
	<view>
		<uni-datetime-picker :border="false" v-if="!preview" v-bind="$attrs" v-model="innerValue"  />
		<view v-else>{{modelValue}}</view>
	</view>
</template>

<script>
	export default {
		name:"form-input",
		props:{
			value: [String, Number],
			modelValue: [Number, String],
			preview: {
				type:Boolean,
				default:false
			},
		},
		data() {
			return {
				innerValue:this.modelValue
			};
		},
		watch:{
			value(newVal){
				this.innerValue = newVal;
			},
			modelValue(newVal) {
				this.innerValue = newVal;
			},
			innerValue(newVal){
				this.$emit("update:value", newVal)
				this.$emit("update:modelValue", newVal)
			}
		}
	}
</script>

<style lang="scss">

</style>