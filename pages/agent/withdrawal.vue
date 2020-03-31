<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我要提现</block>
		</custom>
		<form @submit="withdrawal">
			<view class="text-xsl text-center margin-top">
				<text class=" cuIcon-rechargefill text-yellow"></text>
			</view>
			<view class="text-price text-red text-xxl text-center">
				{{agent_info.agent_money}}
			</view>
			<view class="cu-form-group margin-top solid-bottom solid-top">
				<view class="title">提现金额</view>
				<input v-model="post_data.money" placeholder="输入提现金额" name="input" type="number"></input>
			</view>
			<view class="text-gray padding-lr">*提现说明：100元起提</view>
			<view class="padding">
				<button form-type="submit" class="cu-btn block bg-green lg">申请提现</button>
			</view>
		</form>
	</view>
</template>

<script>
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				agent_info:{
					agent_money:0
				},
				post_data:{}
			};
		},
		onLoad() {
			this.getAgentInfo()
		},
		methods:{
			withdrawal(){
				u.request({
					url:"agent/withdrawal",
					data:this.post_data,
					success:(res)=>{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
						setTimeout(()=>{
							this.BackPage("index")
						},2000)
					}
				})
			},
			getAgentInfo(){
				u.request({
					url:"agent/my_agent_info",
					success:(res)=>{
						this.agent_info = res.info
					}
				})
			}
		}
	}
</script>

<style lang="less">
.cu-form-group .title {
	width: 180rpx;
}
</style>
