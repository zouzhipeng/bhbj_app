<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">申请合伙人</block>
		</custom>
		<form>
			<image class="apply-banner" src="../../static/agent_apply_bg.png" mode="widthFix"></image>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">填写合伙人信息</text>
				</view>
			</view>
			<view class="cu-form-group solid-top solid-bottom">
				<view class="title">合伙人名称</view>
				<input v-model="post_data.agent_name" placeholder="输入你的合伙人名称" name="input"></input>
			</view>
			<view class="padding">
				<button @tap="agentApply" class="cu-btn block bg-green margin-tb-sm lg">申请成为合伙人</button>
			</view>
		</form>
		<loginbox :loginBoxShow.sync="loginBoxShow"></loginbox>
	</view>
</template>

<script>
	const app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				post_data:{},
				loginBoxShow:0,
			};
		},
		methods:{
			agentApply(){
				u.request({
					url:"agent/agent_apply",
					data:this.post_data,
					success:(res)=>{
						// 仅作为示例，非真实参数信息。
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.jsparam.timeStamp,
							nonceStr: res.jsparam.nonceStr,
							package: res.jsparam.package,
							signType: res.jsparam.signType,
							paySign: res.jsparam.paySign,
							success: function (res) {
								uni.showToast({
									title:"申请成功！",
									icon:"success"
								})
								setTimeout(()=>{
									uni.navigateTo({
										url:"index"
									})
								},2000)
							},
							fail: function (err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="less">
.apply-banner{
	width: 100%;
}
</style>
