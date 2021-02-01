<template>
	<view>
		<view class="tabtop">
			<view class="tab-item" :class="PageCur=='home'?'active':''"
				@click="NavChange" data-cur="home">
				首页
			</view>
			<view class="tab-item" :class="PageCur=='center'?'active':''"
				@click="NavChange" data-cur="center">
				我的
			</view>
		</view>
		<home v-if="PageCur=='home'" :toStore="toStore"></home>
		<center v-if="PageCur=='center'" :userInfo="user_info"  @login="login" @loginTo="loginTo"></center>
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
				PageCur: 'home',
				loginBoxShow:0,
				user_info:{},
				toStore:false
			}
		},
		onLoad(p) {
			if(p.cur){
				this.PageCur = p.cur
			}
			if(p.toStore){
				this.toStore = true
			}
		},
		onShow(){
			app.globalData.login(()=>{
				this.user_info = app.globalData.user_info
			},0)
		},
		onShareAppMessage(){
			return {
				title: '特惠洗护，帮洁到家！',
				path: '/pages/index/index?inviter_id='+app.globalData.user_info.user_id
			}
		},
		methods: {
			NavChange: function(e) {
				this.user_info = app.globalData.user_info
				this.PageCur = e.currentTarget.dataset.cur
			},
			login(){
				app.globalData.login(()=>{
					this.user_info = app.globalData.user_info
				})
			},
			loginTo(url){
				app.globalData.login(()=>{
					this.user_info = app.globalData.user_info
					uni.navigateTo({
						url:url
					})
				})
			}
		}
	}
</script>

<style lang="less">
	.tabtop {
		display: flex;
		.tab-item{
			box-sizing: border-box;
			flex-grow: 1;
			text-align: center;
			font-size: 32rpx;
			line-height: 80rpx;
			height: 80rpx;
		}
		.tab-item.active{
			border-bottom: solid 5rpx #61c3d0;
		}
	}
</style>
