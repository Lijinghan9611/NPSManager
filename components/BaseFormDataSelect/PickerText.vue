<template>
	<view class="flex flex-align-items">
		<view class="picker-text flex-1 flex" v-if="!readonly">
			<text class="placeholder flex-1">{{showText}}</text>
			<text class="link">请选择</text>
		</view>
		<view v-else>{{showText}}</view>
	</view>
</template>

<script>
	export default {
		props:{
			text:String,
			readonly:{
				type:Boolean,
				default:false,
			}
		},
		computed:{
			showText(){
				if(this.text && this.text.trim() != ""){
					return this.text;
				}
				if(this.readonly){
					return "";
				}
				return "请选择"
			}
		}
	}
</script>

<style lang="scss" scoped>
	.picker-text{
		position: relative;
		// background-color: #F2F2F2;
		// border: 1px solid #F0F0F0;
		padding: 8px;
		box-sizing: border-box;
		border-radius: 5px;
		
		.placeholder{
			color: $readonly-text;
		}
	}
</style>