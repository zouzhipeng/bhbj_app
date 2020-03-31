<template>
	<view>
		<view class="diy-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="diy-bar" :style="style" :class="[bgImage!=''?'bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="icon icon-arrow-left"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
				// StatusBar: 0,
				// CustomBar: 100
			};
		},
		name: 'custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			// BackPage() {
			// 	this.BackPage()
			// }
		}
	}
</script>

<style lang="less">
	.diy-custom {
		display: block;
		width: 100%;
		position: relative;
		.diy-bar{
			display: flex;
			position: fixed;
			width: 100%;
			color: #fff;
			.content {
				width: calc(100% - 400rpx);
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.action{
				box-sizing: border-box;
				width: 200rpx;
				display: flex;
				align-items: center;
				padding: 0 20rpx;
			}
		}
		
	}
</style>
