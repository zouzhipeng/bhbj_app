<template>
	<view class="order-page">
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">预约下单</block>
		</custom>
		<view v-if="order.delivery!=0" class="order-title">
			<text>收衣地址</text>
		</view>
		<view v-if="order.delivery!=0" class="order-form">
			<view class="f-row">
				<view class="f-label">您的称呼</view>
				<view class="f-input"><input v-model="order.name" placeholder="收送上门联系人"></view>
			</view>
			<view class="f-row">
				<view class="f-label">联系电话</view>
				<view class="f-input"><input v-model="order.phone" placeholder="收送上门电话" type="number"></view>
			</view>
			<view class="f-row">
				<view class="f-label">上门地址</view>
				<view class="f-input"><input v-model="order.address" placeholder="填写小区楼栋加房号"></view>
			</view>
		</view>
		<view class="order-title">
			<text>配送方式</text>
		</view>
		<view class="order-form">
			<view class="f-row">
				<view class="f-label">选择配送</view>
				<radio-group class="f-radio" @change="deliveryChange">
					<label>
						<radio value="0" :checked="order.delivery==0"/>
						<text>到店消费</text>
					</label>
					<label>
						<radio value="1" :checked="order.delivery==1"/>
						<text>配送</text>[￥<text class="text-red">{{delivery_money||0}}</text>元]
					</label>
				</radio-group>
			</view>
		</view>
		<view class="order-title">
			<text>订单详情</text>
		</view>
		<view class="order-cart">
			<view v-for="(item,index) in cart" :key="index" class="package-item">
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
		<view class="order-title">
			<text>下单说明</text>
		</view>
		<view class="order-explain">
			<rich-text :nodes="explain"></rich-text>
		</view>
		
		<view class="pay-block">
			<view class="pay-box">
				<view class="pay-info">
					<view><text space="nbsp">配送费：￥<text class="text-red">{{order.delivery_money||'0'}}</text>元  套餐费：￥<text class="text-red">{{order.order_money||'0'}}</text>元</text></view>
					<view>共计：￥<text class="text-red">{{order.money||'0'}}</text>元</view>
				</view>
				<view class="pay-submit">
					<button @tap="orderSubmit" class="btn">下单</button>
				</view>
			</view>
		</view>
		<loginbox :loginBoxShow.sync="loginBoxShow"></loginbox>
	</view>
</template>

<script>
	let app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				cart:[],
				order:{
					name:"",
					phone:"",
					phone:"",
					delivery:0,
					delivery_money:0,
					money:0,
				},
				user_info:{},
				explain:"",
				delivery_money:0,
				loginBoxShow:0,
			}
		},
		onLoad(){
			this.cart = app.globalData.cart
			
			app.globalData.login(()=>{
				this.user_info = app.globalData.user_info
				this.order.name = this.user_info.nickname
				this.order.phone = this.user_info.phone
				this.order.address = this.user_info.address
				
				u.getConfig((sys_config)=>{
					//this.explain = sys_config.wxapp_order_explain.replace(/\n/g,"<br>")
					this.explain = sys_config.wxapp_order_explain
					//this.delivery_money = sys_config.wxapp_delivery_money
					this.orderCalc()
				})
				
			})
		},
		methods: {
			deliveryChange(e){
				this.order.delivery = parseFloat(e.detail.value)
				this.orderCalc()
			},
			orderCalc(){
				this.delivery_money = 0
				for (var i in this.cart) {
					this.delivery_money += parseFloat(this.cart[i].delivery_money)
				}
				this.order.delivery_money = this.order.delivery?this.delivery_money:0
				
				var _cart_money = 0
				for(var i in this.cart){
					_cart_money+=parseFloat(this.cart[i].money)*this.cart[i].num;
				}
				
				this.order.order_money = _cart_money
				this.order.money = (this.order.order_money+parseFloat(this.order.delivery_money))
			},
			orderSubmit(){
				this.order.goods = JSON.stringify(this.cart)
				u.request({
					url:"wxapp_order/create",
					data:this.order,
					success:(res)=>{
						var wxapp_order_no = res.wxapp_order_no
						// 仅作为示例，非真实参数信息。
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.jsparam.timeStamp,
							nonceStr: res.jsparam.nonceStr,
							package: res.jsparam.package,
							signType: res.jsparam.signType,
							paySign: res.jsparam.paySign,
							success: function (res) {
								console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title:"支付成功！"
								})
								setTimeout(()=>{
									uni.navigateTo({
										url:"../order/info?order_no="+wxapp_order_no
									})
								},2000)
							},
							fail: function (err) {
								console.log('fail:' + JSON.stringify(err));
								uni.navigateTo({
									url:"../order/info?order_no="+wxapp_order_no
								})
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("../../static/config.less");
	.order-page{
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
			flex-shrink: 0;
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
			flex-shrink: 0;
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
	.order-explain{
		background-color: #fff;
		padding: 0 20rpx 20rpx 20rpx;
		font-size: 26rpx;
		line-height: 1.5;
	}
	.pay-block{
		height: 100rpx;
		.pay-box{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
			background-color: #fff;
			box-shadow: 0 0 10rpx rgba(0,0,0,.3);
			display: flex;
			z-index: 3000;
			.pay-info{
				flex-grow: 1;
				text-align: right;
				font-size: 26rpx;
				line-height: 1.5;
				padding: 10rpx 20rpx;
				
			}
			.pay-submit{
				display: flex;
				align-items: center;
			}
		}
	}
</style>
