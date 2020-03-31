<template>
	<view class="user-center">
		<view class="user-head">
			<view class="user-headimg">
				<image :src="userInfo.headimgurl||'/static/img/default_img.jpg'" mode="aspectFill"></image>
				<view v-if="userInfo.nickname">{{userInfo.nickname}}</view>
				<view v-else @tap="login">点击登入</view>
			</view>
		</view>
		<view class="menu">
			<view @tap="loginTo('/pages/order/list')" class="menu-item">
				<icon class="menu-icon icon icon-dingdan"></icon>
				<text class="flex-grow">我的商城订单</text>
				<icon class="icon icon-arrow-right"></icon>
			</view>
			<view @tap="loginTo('/pages/user/package_list')" class="menu-item">
				<icon class="menu-icon icon icon-dingdan"></icon>
				<text class="flex-grow">我的预约单</text>
				<icon class="icon icon-arrow-right"></icon>
			</view>
			<view @tap="loginTo('/pages/user/order_list')" class="menu-item">
				<icon class="menu-icon icon icon-wenjian"></icon>
				<text class="flex-grow">我的洗衣单</text>
				<icon class="icon icon-arrow-right"></icon>
			</view>
			<button open-type="contact" class="menu-item">
				<icon class="menu-icon icon icon-kefu"></icon>
				<text class="flex-grow">帮洁客服</text>
				<icon class="icon icon-arrow-right"></icon>
			</button>
			<button open-type="feedback" class="menu-item">
				<icon class="menu-icon icon icon-help"></icon>
				<text class="flex-grow">意见反馈</text>
				<icon class="icon icon-arrow-right"></icon>
			</button>
			<button v-if="userInfo.agentInfo" @tap="navTo('/pages/agent/index')" class="menu-item">
				<icon class="menu-icon icon icon-dailishang"></icon>
				<text class="flex-grow">合伙人中心</text>
				<icon class="icon icon-arrow-right"></icon>
			</button>
			<button v-else @tap="navTo('/pages/agent/agent_apply')" class="menu-item">
				<icon class="menu-icon icon icon-dailishang"></icon>
				<text class="flex-grow">合伙人申请</text>
				<icon class="icon icon-arrow-right"></icon>
			</button>
		</view>
		<view class="copyright">
			copyright | 百护帮洁
		</view>
	</view>
</template>

<script>
	//let app
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
			}
		},
		props: {
			userInfo: {
				type: Object,
				default() {
					return {
						headimgurl:"",
					}
				}
			},
		},
		mounted(){
			//app = getApp()
			//console.log(this.userInfo)
		},
		methods: {
			login(){
				this.$emit('login');
				// app.globalData.login(()=>{
				// 	this.user_info = app.globalData.user_info
				// })
			},
			loginTo(url){
				this.$emit('loginTo',url);
			}
		},
		
	}
</script>

<style lang="less">
	@import url("../../static/config.less");
	.user-head{
		position: relative;
		height: 400rpx;
		background-color: #fff;
		.user-headimg{
			position: absolute;
			width: 350rpx;
			left: 200rpx;
			top: 100rpx;
			text-align: center;
			z-index: 2;
			color: #fff;
			image{
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
			}
		}
	}
	.user-head:after {
		width: 140%;
		height: 400rpx;
		position: absolute;
		left: -20%;
		bottom:0rpx;
		z-index: 1;
		content: '';
		border-radius: 0 0 50% 50%;
		background: @m_color;
	}
	.user-center .menu{
		background-color: #fff;
		padding: 40rpx;
		.menu-item{
			padding: 20rpx;
			border-top: solid 1rpx #C0C0C0;
			display: flex;
			align-items: center;
			line-height: 1.5;
			font-size: 32rpx;
			text-align: left;
			background-color: #fff;
			border-radius: 0;
			.menu-icon{
				padding-right: 20rpx;
			}
			.icon{
				font-size: 42rpx;
			}
		}
		.menu-item:after{
			border: none;
		}
		.menu-item:first-child{
			border-top: none;
		}
	}
	.copyright{
		padding: 50rpx;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}
</style>
