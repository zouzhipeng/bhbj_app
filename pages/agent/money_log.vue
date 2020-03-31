<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">合伙人客户</block>
		</custom>
		<view class="cu-list menu-avatar">
			<view v-for="(item,index) in list" :key="index" class="cu-item">
				<image class="cu-avatar round lg" :src="item.headimgurl||'../../static/img/default_img.jpg'" mode="aspectFill"></image>
				<view class="content">
					<view class="text-grey">{{item.nickname}}</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							{{u.timeToStr(item.add_time)}}
						</view>
					</view>
				</view>
				<view class="text-center">
					<view class="text-grey text-xs">相关金额</view>
					<view class="text-price text-red">{{item.money}}</view>
					<!-- <view class="cu-tag round bg-grey sm">5</view> -->
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
				u:u,
				page:1,
				list:[],
			};
		},
		onLoad(p) {
			this.getAgentMoneyList()
		},
		onReachBottom() {
			this.page++
			this.getAgentMoneyList()
		},
		methods: {
			getAgentMoneyList(){
				u.request({
					url:"agent/my_money_list",
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
