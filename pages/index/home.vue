<template>
	<view>
		<swiper class="home-imgs" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="home-title">
			<text>限时抢</text>
			<view @tap="showModal = 'wxapp_scope_desc'" class="home-right">
				<icon class="icon icon-help"></icon>
				可选范围
			</view>
		</view>
		<view class="package-list">
			<view v-for="(item,index) in goods_list" :key="index" @tap="navTo('/pages/goods/info?id='+item.wxapp_goods_id)" class="package-item">
				<view class="image">
					<image :src="item.img||'/static/img/default_img.jpg'" mode="aspectFill"></image>
					<!-- <view class="image-title">{{item.title}}</view> -->
				</view>
				<!-- <view class="title">{{item.title}}</view>
				<view class="price">￥{{item.money}}<text class="tag">会员价</text></view> -->
				<view v-if="!item.stock||item.stock<=0" class="sell-out">售罄</view>
			</view>
			
		</view>
		<view class="home-title">
			<text>直营门店</text>
		</view>
		<view class="store-list">
			<view v-for="(item,index) in store_list" :key="index" @tap="openLocation(item)" class="store-item">
				<icon class="icon icon-mendian"></icon>
				<view class="flex-grow">
					<view class="store-name">{{item.store_name}}</view>
					<view class="store-address">地址：{{item.address}}</view>
				</view>
				<icon class="icon icon-daohang"></icon>
			</view>
		</view>
		<view class="cart-block">
			<view @tap="hideCartList" class="cart_list_mask" :class="show_cart_list?'show':''"></view>
			<scroll-view scroll-y="true" class="cart_list" :class="show_cart_list?'show':''">
				<view v-for="(item,index) in cart" :key="index" class="package-item">
					<view class="image"><image :src="item.img||'/static/img/default_img.jpg'" mode="aspectFit"></image></view>
					<view class="flex-grow">
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
			</scroll-view>
			<view v-if="cart.length > 0" class="cart-box">
				<icon @tap="showCartList" class="cart-icon icon icon-gouwuche">
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
		<view v-if="showModal == 'wxapp_scope_desc'" @tap="showModal = ''" class="modal">
			<view class="dialog scope-desc" @tap.stop>
				<text space="nbsp">{{wxapp_scope_desc}}</text>
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
				swiperList: [],
				store_list:[],
				goods_list:[],
				cart_num:0,
				cart_money:0,
				cart:[],
				show_cart_list:0,
				showModal:'',
				wxapp_scope_desc:"",
			}
		},
		name:"home",
		mounted() {
			app = getApp()
			
			this.storeList()	
			this.goodsList()
			// if(app.globalData.cart.length>0){
			// 	this.cart = app.globalData.cart
			// }
			u.getConfig((sys_config)=>{
				console.log(sys_config)
				this.wxapp_scope_desc = sys_config.wxapp_scope_desc
				this.swiperList = sys_config.wxapp_banner.split(",")
			})
		},
		methods: {
			storeList(){
				u.request({
					url:"store/get_list",
					passloading:1,
					success:(res)=>{
						this.store_list = res.list
					}
				})
			},
			goodsList(){
				u.request({
					url:"goods/get_list",
					data:{
						page:1,
						page_size:20
					},
					passloading:1,
					success:(res)=>{
						this.goods_list = res.list
					}
				})
			},
			//加入购物车
			addToCart(item){
				var _item = false;
				for(var i in this.cart){
					if(this.cart[i].id == item.id){
						_item = this.cart[i]
					}
				}
				if(_item){
					_item.num++
				}
				else{
					_item = Object.assign({},item)
					if(!_item.stock||_item.stock<=0){
						uni.showToast({
							title:_item.title+"库存不足",
							icon:"none"
						})
						return
					}
					_item.num = 1
					this.cart.push(_item)
				}
				uni.showToast({
					title:"已加入购物车",
					icon:"none"
				})
				this.cartCalc()
			},
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
					_cart_money+=parseFloat(this.cart[i].money);
				}
				this.cart_num = _cart_num
				this.cart_money = _cart_money
				app.globalData.cart = this.cart
			},
			//显示
			showCartList(){
				this.show_cart_list = 1
			},
			//隐藏
			hideCartList(){
				this.show_cart_list = 0
			},
			orderSubmit(){
				if(this.cart.length<=0){
					return
				}
				app.globalData.login(()=>{
					uni.navigateTo({
						url:'order'
					})
				})
			},
			openLocation(item){
				console.log(item)
				uni.openLocation({
					latitude: item.latitude,
					longitude: item.longitude,
					success: function () {
						console.log('success');
					}
				});
			}
		}
	}
</script>

<style lang="less">
	@import url("../../static/config.less");
	.home-imgs{
		image{
			width: 100%;
			height: 300rpx;
		}
	}
	.home-title{
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 20rpx;
		font-size: 32rpx;
		background-color: #fff;
		>text{
			padding-left: 20rpx;
		}
		.home-right{
			float:right;
			padding-right: 20rpx;
			font-size: 28rpx;
		}
	}
	.home-title::before{
		display: inline-block;
		content: " ";
		width: 10rpx;
		height: 20rpx;
		background-color: @m_color;
	}
	.package-list{
		// white-space: nowrap;
		// height: 420rpx;
		background-color: #fff;
		padding: 20rpx;
		.package-item{
			display: inline-block;
			width: 320rpx;
			height: 420rpx;
			// box-shadow: inset 20rpx 0rpx 20rpx -20rpx #fff,
   //           inset -20rpx 0rpx 20rpx -20rpx #ccc;
			margin: 20rpx 20rpx 0 15rpx;
			.image{
			 	width: 100%;
			 	height: 420rpx;
			 	position: relative;
			}
			.title{
				text-align: center;
			}
			.price{
				align-items: center;
				justify-content: space-between;
			}
		}
	}
	.package-item{
		position: relative;
		// margin-right: 10rpx;
		>.image{
			width: 100%;
			height: 240rpx;
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
			color: #FF9966;
			.tag{
				padding: 0 10rpx;
				box-sizing: border-box;
				font-size: 18rpx;
				line-height: 32rpx;
				color: #FF9966;
				height: 36rpx;
				border: solid 1rpx #FF9966;
				border-radius: 10rpx;
			}
		}
		.sell-out{
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			font-size: 24rpx;
			color: #FF6666;
			padding: 5rpx 20rpx;
			border: solid 1rpx #FF6666;
			background-color: #fff;
			border-radius: 10rpx;
			line-height: 1.5;
		}
	}
	.store-list{
		padding: 0 20rpx 20rpx 20rpx;
		background-color: #fff;
		.store-item{
			box-sizing: content-box;
			height: 80rpx;
			display: flex;
			padding: 20rpx 0;
			border-top: solid 1rpx #cccccc;
			.icon{
				font-size: 60rpx;
				line-height: 80rpx;
				width: 80rpx;
				color: @m_color;
			}
			.store-name{
				font-size: 32rpx;
				line-height: 1.5;
			}
			.store-address{
				font-size: 24rpx;
				color: #999999;
			}
		}
		.store-item:first-child{
			border-top: none;
		}
	}
	.cart-block{
		height: 100rpx;
		.cart_list_mask{
			position: fixed;
			top:0rpx;
			left:0rpx;
			width: 100%;
			height: 0rpx;
			opacity: 0;
			background-color: rgba(0,0,0,.5);
			transition: opacity 300ms ease-out;
			z-index: 1000;
		}
		.cart_list{
			box-sizing: border-box;
			position: fixed;
			bottom:0rpx;
			left:0rpx;
			width: 100%;
			height: 0rpx;
			background-color: #fff;
			transition: height 300ms ease-out;
			box-sizing: border-box;
			z-index: 2000;
			
			.package-item{
				display: flex;
				padding: 5rpx 0;
				border-bottom: solid 1rpx #ccc;
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
			}
			.cart-control{
				display: flex;
				width: 100rpx;
				align-items: center;
				.num{
					width: 40rpx;
					font-size: 24rpx;
					text-align: center;
				}
				.subtr,.add{
					display: flex;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					line-height: 30rpx;
					font-size: 18rpx;
					background-color: @m_color;
					color: #fff;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.cart_list_mask.show{
			opacity:1;
			height: 100%;
		}
		.cart_list.show{
			height: 400rpx;
			padding: 20rpx;
		}
	}
	.cart-box{
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
		.cart-icon{
			position: relative;
			font-size: 70rpx;
			width: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #999999;
			.cart-num{
				position: absolute;
				width: 30rpx;
				height: 30rpx;
				line-height: 30rpx;
				right: -10rpx;
				top: 10rpx;
				border-radius: 50%;
				background-color: #f00;
				color: #fff;
				font-size: 24rpx;
			}
		}
		.cart-info{
			text-align: right;
			padding: 0 20rpx;
			flex-grow: 1;
			line-height: 100rpx;
		}
		.cart-submit{
			display: flex;
			align-items: center;
		}
	}
	.scope-desc{
		max-width: 500rpx;
		font-size: 26rpx;
		line-height: 1.5;
	}
</style>
