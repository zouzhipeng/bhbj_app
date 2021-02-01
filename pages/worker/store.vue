<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">工作台</block>
		</custom>
		<view class="cu-list menu">
			<view v-for="(item,index) in store_list" :key="index" class="cu-item">
				<view class="content flex">
					<text class="cuIcon-shop text-red margin-right-xs" style="font-size: 48rpx;"></text>
					<text class="text-grey">{{item.store_name}}</text>
				</view>
				<view class="action">
					<view @tap="navTo('store_code?store_id='+item.store_id)" class="cu-tag round bg-orange">唛号</view>
					<view @tap="navTo('store_order?store_id='+item.store_id)" class="cu-tag round bg-olive">订单</view>
				</view>
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
				store_list:[],
			};
		},
		onLoad() {
			this.storeList()
		},
		methods:{
			storeList(fn){
				u.request({
					url:"store/get_list",
					data:{
						all_show:1,
					},
					passloading:1,
					success:(res)=>{
						this.store_list = res.list
						fn&&fn()
					}
				})
			},
		}
	}
</script>

<style lang="less">

</style>
