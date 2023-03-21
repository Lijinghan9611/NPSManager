<template>
	<view v-if="show" class="not-found">
		<view>
			<image class="image" src="/static/images/not-found.png"></image>
		</view>
		<text class="text">{{text}}</text>
	</view>
</template>
<script>
	export default {
		name: 'NotFound',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			text: {
				type: String,
				default: "没有找到记录"
			},
		},
		data() {
			return {};
		}
	};
</script>
<style lang="scss">
	.not-found {

		text-align: center;
		margin-top: 20px;

		.image {
			width: 550rpx;
			height: 550rpx;
		}

		.text {
			position: relative;
			top: -200rpx;
		}
	}
</style>
