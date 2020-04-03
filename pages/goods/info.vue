<template>
	<view style="margin-bottom: 200rpx;">
		<view @tap="BackPage" class="cuIcon-back cu-avatar round bg-red back"></view>
		<!-- <view @tap="buildPoster" class="cuIcon-qr_code text-red bg-white line-red poster">
			<text class="text-df">生成海报</text>
		</view> -->
		<swiper class="pa-image" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item,index) in info.img_list" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<canvas canvas-id="poster" class="poster-canvas"></canvas>
		<view class="cu-bar bg-white">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text>{{info.title}}
			</view>
			<view class="action" style="flex-shrink: 0;">
				<text class="text-red">￥{{info.money}}元</text>
			</view>
		</view>
		<view class="flex justify-between bg-white padding-lr-sm padding-bottom-sm solid-bottom">
			<view class="action">
				<view class="cu-capsule round">
					<view class='cu-tag bg-yellow'>合伙人赚</view>
					<view class="cu-tag line-yellow">{{info.agent_bonus>0?info.agent_bonus:(info.money*agent_ratio).toFixed(2)}}</view>
				</view>
			</view>
			<view v-if="user_info.agentInfo" class="action">
				<button @tap="showShare" class="round cu-tag bg-yellow">邀请好友</button>
			</view>
			<view v-else @tap="navTo(user_info.agentInfo?'/pages/agent/index':'/pages/agent/agent_apply')" class="action">
				成为合伙人
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-blue"></text>商品详情
			</view>
		</view>
		<view class="package_info">
			<jyf-parser :html="info.content"></jyf-parser>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='shareModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop>
				<view class="poster-box">
					<image @tap="showImg(poster_url)" :src="poster_url" mode="widthFix"></image>
				</view>
				<view class="padding-xl share-box">
					<button open-type="share" class="action">
						<view class="cuIcon-share"></view>
						分享
					</button>
					<view @tap="downPoster" class="action">
						<view class="cuIcon-down"></view>
						下载海报
					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white tabbar foot border shop">
			<navigator url="../index/index" open-type="reLaunch" class="action">
				<view class="cuIcon-home"></view>
				首页
			</navigator>
			<!-- <button open-type="share" class="action">
				<view class="cuIcon-share"></view>
				分享
			</button> -->
			<view @tap="showShare" class="action">
				<view class="cuIcon-share"></view>
				分享
			</view>
			<navigator url="../index/index?cur=center" open-type="reLaunch" class="action">
				<view class="cuIcon-my"></view>
				我的
			</navigator>
			<!-- <navigator url="cart" class="action">
				<view class="cuIcon-cart">
					<view v-if="cart_num" class="cu-tag badge">{{cart_num}}</view>
				</view>
				购物车
			</navigator> -->
			<block v-if="info.stock>0">
				<!-- <view @tap="addToCart" class="bg-orange submit">加入购物车</view> -->
				<view @tap="submit" class="bg-red submit">立即购买</view>
			</block>
			<view v-else class="bg-grey submit">已售罄</view>
		</view>
		<loginbox :loginBoxShow.sync="loginBoxShow"></loginbox>
		<rollorder :top="140"></rollorder>
	</view>
</template>

<script>
	const app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				info:{},
				loginBoxShow:0,
				agent_ratio:0,
				user_info:{},
				poster_url:"",
				cart_num:0,
				cart:[],
				modalName:""
			};
		},
		onLoad(p) {
			if(p.scene){
				p = u.decodeScene(p.scene)
			}
			if(!p.id){
				this.BackPage()
			}
			this.id = p.id
			console.log(p)
			this.goodsInfo()
			
			//购物车同步
			if(app.globalData.cart.length>0){
				this.cart = app.globalData.cart
				this.cartCalc()
			}
			
			app.globalData.login((user_info)=>{
				this.user_info = user_info
			},0)
			u.getConfig((sys_config)=>{
				this.agent_ratio = sys_config.agent_ratio/100
			})
		},
		onShareAppMessage(){
			return {
				title: this.info.title,
				path: '/pages/goods/info?id='+this.id+'&inviter_id='+app.globalData.user_info.user_id
			}
		},
		methods: {
			goodsInfo(){
				u.request({
					url:"goods/get_info",
					data:{
						wxapp_goods_id:this.id
					},
					passloading:1,
					success:(res)=>{
						this.info = res.info
					}
				})
			},
			//加入购物车
			addToCart(){
				var _item = false;
				for(var i in this.cart){
					if(this.cart[i].wxapp_goods_id == this.info.wxapp_goods_id){
						_item = this.cart[i]
					}
				}
				if(_item){
					_item.num++
				}
				else{
					_item = Object.assign({},this.info)
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
			submit(){
				app.globalData.login((user_info)=>{
					this.info.num = 1
					app.globalData.cart = [this.info]
					uni.navigateTo({
						url:'../index/order'
					})
				})
			},
			showShare(){
				this.modalName = "shareModal"
				this.buildPoster()
			},
			downPoster(){
				if(!this.poster_url) return
				uni.saveImageToPhotosAlbum({
					filePath: this.poster_url,
					success: function () {
						uni.showToast({
							title:"已保存图片至相册"
						})
					}
				});
			},
			hideModal(e) {
				this.modalName = null
			},
			//制作海报
			buildPoster(){
				if(this.poster_url){
					// 预览图片
					uni.previewImage({
						urls: [this.poster_url],
						current: 0,
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
						}
					});
					return
				}
				app.globalData.login((user_info)=>{
					var config = [
						{
							type:"img",
							url:u.app_config.domain+"activity/package_qrcode?page=pages/goods/info&scene="+encodeURIComponent("id="+this.id+"&inviter_id="+user_info.user_id),
							x:300,
							y:820,
							w:150,
							h:150,
						},
						{
							type:"img",
							url:this.info.img,
							x:180,
							y:265,
							w:400,
							h:520,
						},
						{
							type:"img",
							url:user_info.headimgurl,
							x:570,
							y:860,
							w:80,
							h:80,
						},
						{
							type:"text",
							text:user_info.nickname,
							x:610,
							y:970,
							size:24,
							align:"center",
							color:"#ffffff"
						},
					]
					
					u.build_poster({
						canvasId:'poster',
						bg_img:u.app_config.domain_root+'public/img/poster_bg.jpg',
						config:config,
						success:(res)=>{
							this.poster_url = res
							// 预览图片
							// uni.previewImage({
							// 	urls: [this.poster_url],
							// 	current: 0,
							// 	longPressActions: {
							// 		itemList: ['发送给朋友', '保存图片', '收藏'],
							// 	}
							// });
						}
					})
				})
			}
		}
	}
</script>

<style lang="less">
	.pa-image{
		height: 750rpx;
		image{
			height: 100%;
			width: 100%;
		}
	}
	.back{
		position: absolute;
		top: 50rpx;
		left: 20rpx;
		z-index: 1000;
	}
	.poster{
		position: absolute;
		top: 150rpx;
		right: 20rpx;
		font-size: 64rpx;
		width: 120rpx;
		height: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 2000;
		border-radius: 10rpx;
		>text{
			font-weight: bold;
		}
	}
	// .poster::after{
	// 	content: "生成海报";
	// 	position: absolute;
	// 	top: 80rpx;
	// 	left: -20rpx;
	// 	width: 120rpx;
	// 	font-size: 24rpx;
	// 	text-align: center;
	// 	color: #e54d42;
	// 	text-shadow: 0 0 5rpx #fff;
	// }
	.package_info{
		background-color: #fff;
		padding: 20rpx;
	}
	.share-box{
		height: 200rpx;
		display: flex;
		justify-content:space-between;
		align-items: center;
		>.action{
			flex:1;
			border: none;
			font-size: 32rpx;
			line-height: 48rpx;
			[class*="cuIcon-"] {
				font-size: 60rpx;
				height: 60rpx;
				line-height: 60rpx;
			}
		}
		>.action::after{
			border: none;
		}
	}
	
	.poster-box{
		position: fixed;
		top: 200rpx;
		left: 0;
		width: 100%;
		text-align: center;
		image{
			width: 500rpx;
			margin: auto;
		}
	}
</style>
