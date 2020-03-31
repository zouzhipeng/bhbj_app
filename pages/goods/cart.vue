<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">购物车</block>
		</custom>
		<view scroll-y="true" class="cart_list" :class="show_cart_list?'show':''">
			<view v-for="(item,index) in cart" :key="index" class="package-item">
				<view class="image"><image :src="item.img||'/static/img/default_img.jpg'" mode="aspectFit"></image></view>
				<view class="flex-grow cart-text">
					<view class="title">{{item.title}}</view>
					<view class="price">￥{{item.money}}<text class="tag">会员价</text></view>
				</view>
				<view class="cart-control">
					<view @tap="cartNumSubtr(index)" class="subtr icon icon-subtr"></view>
					<view class="num">{{item.num}}</view>
					<view @tap="cartNumAdd(index)" class="add icon icon-add"></view>
				</view>
			</view>
			<view v-if="cart.length <= 0" class="text-center">
				购物车是空的
			</view>
		</view>
		<view class="cart-box">
			<icon class="cart-icon icon icon-gouwuche">
				<view v-if="cart_num" class="cart-num">{{cart_num}}</view>
			</icon>
			<view class="cart-info">
				下单金额：￥{{cart_money||'0'}}元
			</view>
			<view class="cart-submit">
				<button @tap="orderSubmit" class="btn">下单</button>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				cart:[],
				cart_money:0,
				cart_num:0,
			};
		},
		onLoad() {
			if(app.globalData.cart.length>0){
				this.cart = app.globalData.cart
			}
			this.cartCalc()
		},
		methods:{
			
			cartNumSubtr(index){
				this.cart[index].num--
				if(this.cart[index].num<=0){
					this.$delete(this.cart, index)
				}
				this.cartCalc()
			},
			cartNumAdd(index){
				this.cart[index].num++
				this.cartCalc()
			},
			cartCalc(){
				var _cart_num = 0
				var _cart_money = 0
				
				for(var i in this.cart){
					_cart_num+=this.cart[i].num
					_cart_money+=parseFloat((this.cart[i].money*this.cart[i].num).toFixed(2));
				}
				this.cart_num = _cart_num
				this.cart_money = _cart_money
				app.globalData.cart = this.cart
			},
			orderSubmit(){
				if(this.cart.length<=0){
					return
				}
				app.globalData.login(()=>{
					uni.navigateTo({
						url:'../index/order'
					})
				})
			},
		}
	}
</script>

<style lang="less">
	@import url("../../static/config.less");
	.cart_list{
		box-sizing: border-box;
		padding: 20rpx;
		.package-item{
			display: flex;
			padding: 5rpx 0;
			border-bottom: solid 1rpx #ccc;
			.image{
				width: 180rpx;
				height: 180rpx;
				flex-shrink: 0;
				padding-right: 20rpx;
			}
		}
		.cart-text{
			display: flex;
			flex-direction: column;
			justify-content: center;
			font-size: 32rpx;
			.title{
				line-height: 1.5;
			}
			.price{
				padding: 0;
				.tag{
					margin-left: 20rpx;
				}
			}
		}
		.cart-control{
			display: flex;
			width: 120rpx;
			align-items: center;
			flex-shrink: 0;
			.num{
				width: 40rpx;
				font-size: 24rpx;
				text-align: center;
			}
			.subtr,.add{
				display: flex;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				line-height: 40rpx;
				font-size: 18rpx;
				background-color: @m_color;
				color: #fff;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
