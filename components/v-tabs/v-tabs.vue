<template>
	<view :id="elId" class="v-tabs">
		<scroll-view
			id="scrollContainer"
			:scroll-x="scroll"
			:scroll-left="scroll ? scrollLeft : 0"
			:scroll-with-animation="scroll"
			:style="{ position: fixed ? 'fixed' : 'relative', zIndex: 1 }"
		>
			<view
				class="v-tabs__container"
				:style="{
					display: scroll ? 'inline-flex' : 'flex',
					whiteSpace: scroll ? 'nowrap' : 'normal',
					background: bgColor,
					height,
					padding
				}"
			>
				<view
					:class="['v-tabs__container-item', { disabled: !!v.disabled }, { 'current-item': current == i }]"
					v-for="(v, i) in tabs"
					:key="i"
					:style="{
						color: current == i ? activeColor : color,
						fontSize: current == i ? fontSize : fontSize,
						fontWeight: bold && current == i ? 'bold' : '',
						justifyContent: !scroll ? 'center' : '',
						flex: scroll ? '' : 1,
						padding: paddingItem
					}"
					@click="change(i)"
				>
					{{ field ? v[field] : v }}
				</view>

				<view
					v-if="!pills"
					:class="['v-tabs__container-line', { animation: lineAnimation }]"
					:style="{
						background: lineColor,
						width: lineWidth + 'px',
						height: lineHeight,
						borderRadius: lineRadius,
						left: lineLeft + 'px',
						transform: `translateX(-${lineWidth / 2}px)`
					}"
				></view>
				<view
					v-else
					:class="['v-tabs__container-pills', { animation: lineAnimation }]"
					:style="{
						background: pillsColor,
						borderRadius: pillsBorderRadius,
						left: pillsLeft + 'px',
						width: currentWidth + 'px',
						height
					}"
				></view>
			</view>
		</scroll-view>
		<view
			class="v-tabs__placeholder"
			:style="{
				height: fixed ? height : '0',
				padding
			}"
		></view>
	</view>
</template>

<script>
/**
 * v-tabs
 * @property {Number} value 选中的下标
 * @property {Array} tabs tabs 列表
 * @property {String} bgColor = '#fff' 背景颜色
 * @property {String} color = '#333' 默认颜色
 * @property {String} activeColor = '#1890FF' 选中文字颜色
 * @property {String} fontSize = '16px' 默认文字大小
 * @property {String} activeFontSize = '28rpx' 选中文字大小
 * @property {Boolean} bold = [true | false] 选中文字是否加粗
 * @property {Boolean} scroll = [true | false] 是否滚动
 * @property {String} height = '60rpx' tab 的高度
 * @property {String} lineHeight = '10rpx' 下划线的高度
 * @property {String} lineColor = '#1890FF' 下划线的颜色
 * @property {Number} lineScale = 0.5 下划线的宽度缩放比例
 * @property {String} lineRadius = '10rpx' 下划线圆角
 * @property {Boolean} pills = [true | false] 是否胶囊样式
 * @property {String} pillsColor = '#1890FF' 胶囊背景色
 * @property {String} pillsBorderRadius = '10rpx' 胶囊圆角大小
 * @property {String} field 如果是对象，显示的键名
 * @property {Boolean} fixed = [true | false] 是否固定
 * @property {String} paddingItem = '0 22rpx' 选项的边距
 * @property {Boolean} lineAnimation = [true | false] 下划线是否有动画
 *
 * @event {Function(current)} change 改变标签触发
 */
export default {
	props: {
		value: {
			type: Number,
			default: 0
		},
		modelValue: { type: Number, default: 0 },
		tabs: {
			type: Array,
			default() {
				return [];
			}
		},
		bgColor: {
			type: String,
			default: '#F5F5F5'
		},
		padding: {
			type: String,
			default: '2px'
		},
		color: {
			type: String,
			default: '#333'
		},
		activeColor: {
			type: String,
			default: '#1890FF'
		},
		fontSize: {
			type: String,
			default: '16px'
		},
		activeFontSize: {
			type: String,
			default: '18px'
		},
		bold: {
			type: Boolean,
			default: true
		},
		scroll: {
			type: Boolean,
			default: true
		},
		height: {
			type: String,
			default: '35px'
		},
		lineColor: {
			type: String,
			default: '#1890FF'
		},
		lineHeight: {
			type: String,
			default: '3px'
		},
		lineScale: {
			type: Number,
			default: 0.5
		},
		lineRadius: {
			type: String,
			default: '10rpx'
		},
		pills: {
			type: Boolean,
			default: false
		},
		pillsColor: {
			type: String,
			default: '#1890FF'
		},
		pillsBorderRadius: {
			type: String,
			default: '10rpx'
		},
		field: {
			type: String,
			default: ''
		},
		fixed: {
			type: Boolean,
			default: false
		},
		paddingItem: {
			type: String,
			default: '0 22rpx'
		},
		lineAnimation: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			elId: '',
			lineWidth: 30,
			currentWidth: 0, // 当前选项的宽度
			lineLeft: 0, // 滑块距离左侧的位置
			pillsLeft: 0, // 胶囊距离左侧的位置
			scrollLeft: 0, // 距离左边的位置
			containerWidth: 0, // 容器的宽度
			current: 0 // 当前选中项
		};
	},
	watch: {
		value(newVal) {
			this.current = newVal;
			this.$nextTick(() => {
				this.getTabItemWidth();
			});
		},
		modelValue(newVal) {
			this.current = newVal;
			this.$nextTick(() => {
				this.getTabItemWidth();
			});
		},
		current(newVal) {
			this.$emit('input', newVal);
			this.$emit('update:modelValue', newVal);
			this.$nextTick(() => {
				this.getTabItemWidth();
			});
		},
		tabs(newVal) {
			this.$nextTick(() => {
				this.getTabItemWidth();
			});
		}
	},
	methods: {
		// 产生随机字符串
		randomString(len) {
			len = len || 32;
			let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
			let maxPos = $chars.length;
			let pwd = '';
			for (let i = 0; i < len; i++) {
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		},
		// 切换事件
		change(index) {
			const isDisabled = !!this.tabs[index].disabled;
			if (this.current !== index && !isDisabled) {
				this.current = index;

				this.$emit('change', index);
			}
		},
		// 获取左移动位置
		getTabItemWidth() {
			let query = uni
				.createSelectorQuery()
				// #ifndef MP-ALIPAY
				.in(this);
			// #endif
			// 获取容器的宽度
			query
				.select(`#scrollContainer`)
				.boundingClientRect(data => {
					if (!this.containerWidth && data) {
						this.containerWidth = data.width;
					}
				})
				.exec();
			// 获取所有的 tab-item 的宽度
			uni.createSelectorQuery()
				.in(this)
				.select('.current-item')
				.boundingClientRect(data => {
					if (!data) {
						return;
					}
					//console.log(data, this.containerWidth)
					//let lineLeft = data.left;
					let currentWidth = data.width;

					// 当前滑块的宽度
					this.currentWidth = data.width;
					// 缩放后的滑块宽度
					this.lineWidth = currentWidth * this.lineScale * 1;
					
					let lineLeft = 0;
					if(this.tabs.length > 0){
						lineLeft = this.containerWidth / this.tabs.length * this.current;
					}
					// 滑块作移动的位置
					this.lineLeft = lineLeft + currentWidth / 2;
					// 胶囊距离左侧的位置
					this.pillsLeft = lineLeft;
					// 计算滚动的距离左侧的位置
					// console.log(this.containerWidth)
					// console.log(this.lineWidth)
					// console.log(this.scrollLeft)
					if (this.scroll) {
						this.scrollLeft = this.lineLeft - this.containerWidth / 2;
					}
				})
				.exec();
		}
	},
	mounted() {
		this.elId = 'xfjpeter_' + this.randomString();
		this.current = this.value;
		this.$nextTick(() => {
			this.getTabItemWidth();
		});
	}
};
</script>

<style lang="scss" scoped>
.v-tabs {
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;

	::-webkit-scrollbar {
		display: none;
	}

	&__container {
		min-width: 100%;
		position: relative;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		overflow: hidden;
		
		&::after{
			position: absolute;
			box-sizing: border-box;
			content: " ";
			pointer-events: none;
			right: 0;
			bottom: 0;
			left: 0;
			border-bottom: 1px solid #DCDFE6;
			transform: scaleY(.5);
		}
		

		&-item {
			display: flex;
			align-items: center;
			height: 100%;
			position: relative;
			z-index: 10;
			// padding: 0 11px;
			transition: all 0.3s;
			white-space: nowrap;
			&.disabled {
				opacity: 0.5;
				color: #999;
			}
		}

		&-line {
			position: absolute;
			bottom: 0;
		}

		&-pills {
			position: absolute;
			z-index: 9;
		}
		&-line,
		&-pills {
			&.animation {
				transition: all 0.3s linear;
			}
		}
	}
}
</style>
