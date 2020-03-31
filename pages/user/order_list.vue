<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">洗衣订单</block>
		</custom>
		<view class="order_list">
			<navigator v-for="(item,index) in order_list" :key="index" :url="'/pages/user/order_info?id='+item.order_id" class="order_item">
				<view class="order_info">
					<view>送洗人：{{item.nickname}}</view>
					<view>衣物总计：{{item.goods_count}}件</view>
					<view>送洗时间：{{u.timeToStr(item.start_time)}}</view>
					<view>备注信息：{{item.remark||""}}</view>
				</view>
				<view class="order_status">
					<view v-if="item.progress == 0">
						<view class="icon icon-xiyiji order_icon"></view>
						<view class="order_status_txt">未付款...</view>
					</view>
					<view v-if="item.progress == 1">
						<view class="icon icon-xiyiji order_icon"></view>
						<view class="order_status_txt">玩命洗衣中...</view>
					</view>
					<view v-if="item.progress == 2">
						<view class="icon icon-yijieshu order_icon"></view>
						<view class="order_status_txt">待取走...</view>
					</view>
					<view v-if="item.progress == 3">
						<view class="icon icon-yijieshu order_icon"></view>
						<view class="order_status_txt">已经取走...</view>
					</view>
					<view v-if="item.progress == 4">
						<view class="icon icon-yijieshu order_icon"></view>
						<view class="order_status_txt">准备洗...</view>
					</view>
					<view v-if="item.progress == 5">
						<view class="icon icon-yijieshu order_icon"></view>
						<view class="order_status_txt">配送中...</view>
					</view>
					<view class="order_status_txt">消费金额：<text>{{item.money}}元</text></view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				page:1,
				page_size:20,
				u:u,
				order_list:[],
			};
		},
		onLoad() {
			this.load_list()
		},
		onReachBottom() {
			this.page++
			this.load_list()
		},
		methods:{
			load_list(){
				u.request({
					url:"order/get_list",
					data:{
						page:this.page,
						page_size:this.page_size,
					},
					success:(res)=>{
						this.order_list = this.order_list.concat(res.list)
					}
				})
			}
		}
		
	}
</script>

<style lang="less">
	.order_list{
		.order_item{
			width: 720rpx;
			height: auto;
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			padding: 20rpx 30rpx 25rpx 30rpx;
			border-radius: 20rpx;
			margin: 0 auto;
			margin-top: 20rpx;
		}
		
		.order_info{
		    width: 460rpx;
		    height: auto;
		    border-right: 1rpx dashed #268ec5;
		    padding-right: 20rpx;
		    box-sizing: border-box;
		}
		.order_info>view{
			font-size: 26rpx;
			color: #333333;
			line-height: 45rpx;
		}
		.order_status{
			width: 190rpx;
			text-align: center;
			line-height: 50rpx;
		}
		.order_icon{
			font-size: 60rpx;
			color: #0092d8;
			margin-top: 20rpx;
		}
		.order_status_txt{
			font-size: 20rpx;
			color: #333333;
		}
		.order_status_txt>text{
			font-size: 20rpx;
			color: #e20606;
		}
	}
</style>
