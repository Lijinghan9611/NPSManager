<template>
	<view class="base-text" :class="{'flex-col' : column}">
		<view v-if="title" class="base-text_title">
			{{title}}
			<text v-if="delimiter">：</text>
		</view>

		<view class="base-text_text">
			<slot>{{text}}</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "BaseText",
		props: {
			title: [String, Number],
			text: [String, Number],
			column: {
				type: Boolean,
				default: false //顯示方式是否為垂直
			},
			delimiter: {
				type: Boolean,
				default: true //是否顯示分隔符
			},
		}
	}
</script>

<style lang="scss" scoped>
	.base-text {
		display: flex;
		font-size: $uni-font-size-base;

		&_title {
			color: $text-color-2;
			margin-right: $spacing-col-base;
			padding: $spacing-col-text 0;
		}

		&_text {
			color: $text-color;
			padding: $spacing-col-text 0;
		}
	}

	.flex-col {
		flex-direction: column;
	}
</style>
