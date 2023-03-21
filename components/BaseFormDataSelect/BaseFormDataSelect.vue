<template>
	<view>
		<!-- <uni-data-select v-if="!preview" v-bind="$attrs" :localdata="range" v-model="innerValue"></uni-data-select> -->
		<picker v-if="!preview" @change="bindPickerChange" range-key="text" :value="innerValue" :range="range">
			<PickerText :text="range[innerValue]?.text"></PickerText>
		</picker>
		<view v-else>{{readonlyText}}</view>
	</view>
</template>

<script>
import PickerText from "./PickerText.vue"
export default {
	name: 'form-input',
	components:{
		PickerText
	},
	props: {
		value: [String, Number],
		modelValue: [Number, String],
		type: String,
		localRange:Array,
		preview: {
			type:Boolean,
			default:false
		},
	},
	data() {
		return {
			innerValue: -1,
			range:[]
		};
	},
	created() {
		this.initData();
	},
	computed:{
		readonlyText(){
			let item = this.range.find(a =>a.value == this.modelValue);
			if(item){
				return item.text;
			}
			return "";
		}
	},
	watch: {
		value(newVal) {
			let index = this.range.findIndex(a =>a.value === newVal);
			this.innerValue = index;
		},
		modelValue(newVal) {
			let index = this.range.findIndex(a =>a.value === newVal);
			this.innerValue = index;
		},
		innerValue(newVal) {
			this.$emit('update:value', this.range[newVal].value);
			this.$emit('update:modelValue', this.range[newVal].value);
		},
		
	},
	methods:{
		async initData(){
			this.range = this.localRange;
			
			let index = this.range.findIndex(a =>a.value === this.modelValue);
			if(index != -1 ){
				this.innerValue = index;
			}
		},
		bindPickerChange(res){
			this.innerValue = res.detail.value;
		},
	}
};
</script>


