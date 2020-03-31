<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的提现</block>
		</custom>
		<view class="padding">
			<button @tap="navTo('withdrawal')" class="cu-btn bg-red block"><text class="cuIcon-add margin-right-xs"></text>申请提现</button>
		</view>
		<view class="cu-list menu sm-border">
			<view v-for="(item,index) in list" :key="index" class="cu-item">
				<view class="content">
					<text class="cuIcon-text text-grey"></text>
					<text class="text-grey">申请提现<text class="text-price text-red">{{item.money}}</text>元</text>
				</view>
				<view class="action">
					<view v-if="item.status == 1" class="cu-tag round bg-green light">成功</view>
					<view v-else class="cu-tag round bg-orange light">审核</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				page:1,
				list:[],
			};
		},
		onShow(){
			this.page = 1
			this.list = []
			this.getWithdrawalList()
		},
		onReachBottom() {
			this.page++
			this.getWithdrawalList()
		},
		methods: {
			getWithdrawalList(){
				u.request({
					url:"agent/my_withdrawal_list",
					data:{
						page:this.page
					},
					success:(res)=>{
						this.list = this.list.concat(res.list)
					}
				})
			}
		}
	}
</script>

<style lang="less">

</style>
