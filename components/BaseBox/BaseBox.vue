<template>
	<view @click="click" class="box" :class="{ full : full}" :hover-class="hover ? 'list-active' : ''">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "BaseBox",
		props: {
			full: {
				type: Boolean,
				default: false //是否鋪滿頁面
			},
			hover: {
				type: Boolean,
				default: false //點擊是否有反應
			},
		},
		data() {
			return {

			};
		},
		methods:{
			click(){
				this.$emit("click")
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.box {
		margin: $spacing-col-base;
		padding: $spacing-col-medium;
		border-radius: $uni-border-radius-base;
		background-color: #FFFFFF;
	}

	.full {
		margin: 0;
	}
	
	.list-active {
		background-color: $uni-bg-color-hover;
	}
</style>
