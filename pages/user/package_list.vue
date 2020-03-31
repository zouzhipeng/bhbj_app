<template>
	<view>
		<custom bgColor="bg-main" :isBack="true"><block slot="backText">返回</block><block slot="content">预约列表</block></custom>
		<view class="order-list">
			<navigator :url="'package_info?id='+item.activity_user_id" v-for="(item,index) in order_list" :key="index" class="order-item">
				<image src="../../static/logo.png" class="order-ico"></image>
				<view class="order-title">
					<view>[{{item.data.delivery==1?"收送":"到店"}}]{{item.title}}</view>
					<!-- <view><text space="nbsp">姓名：{{item.data.name}}  电话：{{item.phone}}</text></view> -->
				</view>
				<view v-if="item.status==2" class="order-status text-red">待核销</view>
				<view v-if="item.status==3" class="order-status text-green">已核销</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				page:1,
				page_size:20,
				order_list:[],
				is_end:false,
			};
		},
		onLoad(){
			app.globalData.login(()=>{
				this.orderList()
			})
		},
		onReachBottom(){
			this.page++
			this.orderList()
		},
		methods:{
			orderList(){
				if(this.is_end) return;
				u.request({
					url:"activity/my_package_order",
					data:{
						page:this.page,
						page_size:this.page_size,
					},
					success:(res)=>{
						if(res.list.length>0){
							this.order_list = this.order_list.concat(res.list);
						}
						else{
							this.is_end = true
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.order-list{
		padding: 20rpx;
		background-color: #fff;
		.order-item{
			display: flex;
			padding: 10rpx 0;
			border-top: solid 1rpx #C0C0C0;
			height: 80rpx;
			line-height: 80rpx;
			.order-ico{
				font-size:  64rpx;
				margin-right: 20rpx;
				width: 80rpx;
				height: 80rpx;
			}
			.order-title{
				line-height: 1.5;
				font-size: 26rpx;
				flex-grow: 1;
				overflow: hidden;
				// white-space: nowrap;
				display: flex;
				align-items: center;
			}
			.order-status{
				width: 120rpx;
				font-size: 26rpx;
				padding: 0 10rpx;
			}
		}
		
		.order-item:first-child{
			border-top: none;
		}
	}
</style>
