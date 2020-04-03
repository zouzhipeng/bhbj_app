<template>
	<view>
		<custom bgColor="bg-main" :isBack="true"><block slot="backText">返回</block><block slot="content">订单列表</block></custom>
		<view class="order-list">
			<navigator :url="'info?order_no='+item.wxapp_order_no" v-for="(item,index) in order_list" :key="index" class="order-item padding-tb">
				<view class="order-title">
					<view>[订单号]{{item.wxapp_order_no}}</view>
					<view class="order-goods grid col-4 grid-square padding-sm">
						<block v-for="(g_item,g_index) in item.goods" :key="g_index">
							<view v-if="g_index<4" class="bg-img" :style="{backgroundImage: 'url('+g_item.img+')'}"></view>
						</block>
					</view>
				</view>
				<view class="order-status text-red">
					<view>￥{{item.order_money}}</view>
					<view v-if="item.status==1">未支付</view>
					<view v-if="item.status==2">待核销</view>
					<view v-if="item.status==3">已核销</view>
				</view>
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
		},
		onShow(){
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
					url:"wxapp_order/get_list",
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
			}
			.order-goods{
				>view{
					margin-bottom: 0;
				}
			}
			.order-status{
				width: 150rpx;
				font-size: 26rpx;
				padding: 0 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				line-height: 1.5;
			}
		}
		
		.order-item:first-child{
			border-top: none;
		}
	}
</style>
