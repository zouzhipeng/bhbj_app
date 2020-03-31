<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">预约详情</block>
		</custom>
		<view class="info-title">{{info.data.title}}</view>
		<block v-if="info.status==2">
			<view class="order-title">
				<text>二维码请出示给店员</text>
			</view>
			<view class="order-qrcode">
				<view class="qrimg">
				    <tki-qrcode ref="qrcode" :val="qrcode_url" :size="512" :loadMake="true"/>
				</view>
			</view>
		</block>
		<block v-if="info.data.delivery!=0">
			<view class="order-title">
				<text>收衣地址</text>
			</view>
			<view class="order-form">
				<view class="f-row">
					<view class="f-label">您的称呼</view>
					<view class="f-input">{{info.data.name}}</view>
				</view>
				<view class="f-row">
					<view class="f-label">联系电话</view>
					<view class="f-input">{{info.data.phone}}</view>
				</view>
				<view class="f-row">
					<view class="f-label">上门地址</view>
					<view class="f-input">{{info.data.address}}</view>
				</view>
			</view>
		</block>
		<view class="order-title">
			<text>订单详情</text>
		</view>
		<view class="order-cart">
			<view v-for="(item,index) in info.data.goods" :key="index" class="package-item">
				<view class="image"><image :src="item.img||'/static/img/default_img.jpg'" mode="aspectFit"></image></view>
				<view class="flex-grow">
					<view class="title">{{item.title}}</view>
					<view class="price">￥{{item.money}}<text class="tag">会员价</text></view>
				</view>
				<view class="cart-num">
					数量x{{item.num}}
				</view>
			</view>
		</view>
		<view class="text-right">
			下单时间：{{}}
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				info:{
					data:{
						delivery:0
					}
				},
				qrcode_url:"",
				u:u
			};
		},
		components: {tkiQrcode},
		onLoad(p){
			if(!p.id){
				this.BackPage()
			}
			
			this.activity_user_id = p.id
			this.orderInfo()
			
			//生成二维码
			u.getConfig((config)=>{
				this.qrcode_url = config.qrcode_url+"activity_user_id="+this.activity_user_id
				setTimeout(()=>{
					this.$refs.qrcode._makeCode()
				},1000)
			})
		},
		methods:{
			orderInfo(){
				u.request({
					url:"activity/my_package_order_info",
					data:{
						activity_user_id:this.activity_user_id,
					},
					success:(res)=>{
						this.info = res.info
					}
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("../../static/config.less");
	.info-title{
		padding: 50rpx 20rpx;
		font-size: 32rpx;
		text-align: center;
	}
	.order-qrcode{
		text-align: center;
		background-color: #fff;
		padding: 20rpx;
		image{
			width: 640rpx;
			height: 640rpx;
		}
	}
	.order-title{
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 20rpx;
		font-size: 32rpx;
		background-color: #fff;
		>text{
			padding-left: 20rpx;
		}
		.order-right{
			float:right;
			padding-right: 20rpx;
			font-size: 28rpx;
		}
	}
	.order-title::before{
		display: inline-block;
		content: " ";
		width: 10rpx;
		height: 20rpx;
		background-color: @m_color;
	}
	.order-form{
		padding: 0 20rpx 20rpx 20rpx;
		background-color: #fff;
		font-size: 26rpx;
		.f-row{
			display: flex;
			height: 80rpx;
			border-bottom: solid 1rpx #cccccc;
			.f-label{
				display: flex;
				align-items: center;
				width: 200rpx;
				line-height: 1.5;
				padding-left: 20rpx;
			}
			.f-input{
				flex-grow: 1;
				display: flex;
				align-items: center;
				padding-right: 20rpx;
				input{
					height: 100%;
					width: 100%;
					
				}
			}
			.f-radio{
				display: flex;
				align-items: center;
				>label{
					display: flex;
					align-items: center;
					margin-right: 10rpx;
				}
			}
		}
	}
	
	.package-item{
		margin-right: 10rpx;
		>.image{
			width: 100%;
			height: 180rpx;
			position: relative;
			>image{
				width: 100%;
				height: 100%;
			}
			>.image-title{
				white-space: normal;
				box-sizing: border-box;
				position: absolute;
				top: 0rpx;
				left: 0rpx;
				width: 100%;
				height: 100%;
				padding: 30rpx 20rpx 20rpx 40rpx;
				font-size: 32rpx;
				color: #fff;
				text-align: center;
				text-shadow: 0 0 8rpx rgba(0,0,0,.8) ;
				display: flex;
				align-items: flex-end;
			}
		}
		.title{
			font-size: 24rpx;
			line-height: 2;
		}
		.price{
			display: flex;
			padding: 0 10rpx;
			.tag{
				padding: 0 10rpx;
				box-sizing: border-box;
				font-size: 18rpx;
				line-height: 32rpx;
				color: #c3751b;
				height: 36rpx;
				border: solid 1rpx #c3751b;
				border-radius: 10rpx;
			}
		}
	}
	.order-cart{
		background-color: #fff;
		padding: 0 20rpx 20rpx 20rpx;
		.package-item{
			display: flex;
			border-top: solid 1rpx #ccc;
			padding: 10rpx 0;
			.image{
				width: 80rpx;
				height: 80rpx;
				padding-right: 20rpx;
			}
			.title{
				line-height: 1.5;
			}
			.price{
				padding: 0;
				font-size: 24rpx;
				.tag{
					margin-left: 20rpx;
				}
			}
			.cart-num{
				width: 160rpx;
				line-height: 80rpx;
				text-align: right;
			}
		}
		.package-item:first-child{
			border-top: none;
		}
	}
</style>
