<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">合伙人中心</block>
		</custom>
		<view class="margin-bottom text-center bg-main padding-xl">
			<view class="cu-avatar xl round" :style="{backgroundImage:('url('+user_info.headimgurl+')')}"></view>
			<view class="text-center text-lg padding text-white">
				<text>{{agent_info.agent_name||"匿名用户"}}</text>
				<text>(<text class="cuIcon-moneybagfill text-yellow"></text>{{agent_info.agent_money||"0"}}元)</text>
			</view>
		</view>
		
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-group text-orange "></text> 合伙人中心
			</view>
		</view>
		<view class="cu-list col-3 grid no-border">
			<view class="cu-item" @tap="navTo('user_list')">
				<view class="cuIcon-group_fill text-red"></view>
				<text>我的客户</text>
			</view>
			<view class="cu-item" @tap="navTo('money_log')">
				<view class="cuIcon-sponsorfill text-orange"></view>
				<text>分佣记录</text>
			</view>
			<view class="cu-item" @tap="navTo('withdrawal_list')">
				<view class="cuIcon-rechargefill text-yellow"></view>
				<text>我的提现</text>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				agent_info:{},
				user_info:{}
			};
		},
		onLoad() {
			app.globalData.login((user_info)=>{
				this.user_info = user_info
			})
		},
		onShow() {
			this.getAgentInfo()
		},
		onPullDownRefresh(){
			this.getAgentInfo()
		},
		methods:{
			getAgentInfo(){
				u.request({
					url:"agent/my_agent_info",
					success:(res)=>{
						this.agent_info = app.globalData.user_info.agentInfo = res.info
						uni.stopPullDownRefresh();
					}
				})
			}
		}
	}
</script>

<style lang="less">

</style>
