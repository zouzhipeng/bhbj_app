<template>
	<view style="margin-bottom: 200rpx;">
		<view @tap="buildPoster" class="cuIcon-qr_code text-white bg-red round poster"></view>
		<view class="pa-image">
			<image :src="info.img" mode="aspectFit"></image>
		</view>
		<canvas canvas-id="poster" class="poster-canvas"></canvas>
		<view class="cu-bar bg-white">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text>{{info.title}}
			</view>
			<view class="action">
				<text class="text-red">￥{{info.money}}元</text>
			</view>
		</view>
		<view @tap="navTo(user_info.agentInfo?'/pages/agent/index':'/pages/agent/agent_apply')" class="flex justify-between bg-white padding-lr-sm padding-bottom-sm solid-bottom">
			<view class="action">
				<view class="cu-capsule round">
					<view class='cu-tag bg-yellow'>合伙人赚</view>
					<view class="cu-tag line-yellow">{{(info.money*agent_ratio).toFixed(2)}}</view>
				</view>
			</view>
			<view class="action">
				{{user_info.agentInfo?'合伙人中心':'成为合伙人'}}
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-blue"></text>限时购使用须知
			</view>
		</view>
		<view class="package_info">
			<rich-text :nodes="package_info"></rich-text>
		</view>
		<view class="cu-bar bg-white tabbar foot border shop">
			<navigator url="../index/index" open-type="reLaunch" class="action">
				<view class="cuIcon-home"></view>
				首页
			</navigator>
			<button open-type="share" class="action">
				<view class="cuIcon-share"></view>
				分享
			</button>
			<navigator url="../index/index?cur=center" open-type="reLaunch" class="action">
				<view class="cuIcon-my"></view>
				我的
			</navigator>
			<view v-if="info.stock>0" @tap="submit" class="bg-red submit">立即购买</view>
			<view v-else class="bg-grey submit">已售罄</view>
		</view>
		<loginbox :loginBoxShow.sync="loginBoxShow"></loginbox>
		<rollorder></rollorder>
	</view>
</template>

<script>
	const app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				info:{},
				package_info:"",
				loginBoxShow:0,
				agent_ratio:0,
				user_info:{},
				poster_url:"",
			};
		},
		onLoad(p) {
			console.log(p)
			if(p.scene){
				p = u.decodeScene(p.scene)
			}
			if(!p.id){
				this.BackPage()
			}
			this.id = p.id
			this.packageInfo()
			
			app.globalData.login((user_info)=>{
				this.user_info = user_info
			},0)
			u.getConfig((sys_config)=>{
				this.agent_ratio = sys_config.agent_ratio/100
				this.package_info = sys_config.wxapp_package_info
			})
		},
		onShareAppMessage(){
			console.log('/pages/goods/package?inviter_id='+app.globalData.user_info.user_id)
			return {
				title: this.info.title,
				path: '/pages/goods/package?inviter_id='+app.globalData.user_info.user_id
			}
		},
		methods: {
			packageInfo(){
				u.request({
					url:"activity/package_list",
					passloading:1,
					success:(res)=>{
						this.info = res.list[this.id]
					}
				})
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
							url:u.app_config.domain+"activity/package_qrcode?page=pages/index/index&scene="+encodeURIComponent("id="+this.id+"&inviter_id="+user_info.user_id),
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
							uni.previewImage({
								urls: [this.poster_url],
								current: 0,
								longPressActions: {
									itemList: ['发送给朋友', '保存图片', '收藏'],
								}
							});
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
	.poster{
		position: absolute;
		top: 200rpx;
		right: 20rpx;
		font-size: 64rpx;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}
	.poster::after{
		content: "生成海报";
		position: absolute;
		top: 80rpx;
		left: -20rpx;
		width: 120rpx;
		font-size: 24rpx;
		text-align: center;
		color: #e54d42;
	}
	.package_info{
		background-color: #fff;
		padding: 20rpx;
	}
</style>
