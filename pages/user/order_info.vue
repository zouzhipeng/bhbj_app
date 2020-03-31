<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单详情</block>
		</custom>
		<view class="order_content">
			<view class="top">
				<view class="user">送洗人：<text>{{info.username}}</text></view>
				<view class="status">
					{{info.progress_str}}
				</view>
			</view>
			<view class="user_phone"> 手机号：<text>{{info.user_phone}}</text></view>
			<view class="user_phone"> 送洗时间：{{u.timeToStr(info.start_time)}}</view>
			<view class="order_detail_text">送洗衣物详细：</view>
			<view class="order_detail_list">
				<view v-for="(item,index) in goods" :key="index">
					<view>
						<view class="clothes">{{item.goods_name}}</view>
						<view>{{item.num}}件</view>
					</view>
					<view v-if="item.qingxi_user">--------清洗：{{item.qingxi_username}}</view>
					<view v-if="item.dabao_user">--------打包：{{item.dabao_username}}</view>
					<view v-if="item.peisong_user">--------配送：{{item.peisong_user}}</view>
				</view>
			</view>
			<view class="order_detail_text">订单信息：</view>
			<view class="order_detail_list">
				<view>
					<view>
						<view class="clothes">门店：</view>
						<view>{{info.store_name}}</view>
					</view>
					<view v-if="info.quyi_time">
						<view class="clothes">取衣时间：</view>
						<view>{{u.timeToStr(info.quyi_time)}}</view>
					</view>
					<view>
						<view class="clothes">订单备注：</view>
						<view>{{info.remark}}</view>
					</view>
				</view>
			</view>
			<view class="clothes_sum">衣物总计：<text> {{info.goods_count}} </text>件</view>
			<view class="order_bottom">
				<view>取衣方式：{{info.delivery?'配送':'自取'}}</view>
				<view>消费金额：<text>{{info.money}}</text> 元</view>
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
				info:{},
				goods:[],
			};
		},
		onLoad(p) {
			if(!p.id){
				uni.showToast({
					title:"访问错误",
					icon:"none"
				})
				return;
			}
	
			this.order_id = p.id
			this.load_info()
		},
		methods:{
			load_info(){
				u.request({
					url:"order/get_info",
					data:{
						order_id:this.order_id,
					},
					success:(res)=>{
						this.info = res.order_info
						this.goods = res.order_goods
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.order_content{
        width: 720rpx;
        height: auto;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10rpx;
        padding: 35rpx 40rpx 60rpx 40rpx;
        margin-top: 20rpx;
        color: #333333;
        font-size: 24rpx;
    }
    .top{
        display: flex;
        justify-content: space-between;
        line-height: 60rpx;
    }
    .user>text,.status,.user_phone>text{
        font-size: 24rpx;
        color: #00aaee;
    }
    .user_phone,.remark{
        line-height: 60rpx;
    }
    .remark>view{
        line-height: 35rpx;
    }
    .order_detail_text{
        font-size: 24rpx;
        color: #00aaee;
        line-height: 80rpx;
    }
    .order_detail_list>view>view{
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        color: #333333;
        margin-bottom: 20rpx;
    }
    .clothes_sum{
        text-align: right;
        margin-top: 20rpx;
        line-height: 60rpx;
    }
    .clothes_sum>span{
        color: #00aaee;
        font-size: 30rpx;
    }
    .order_bottom{
        width: 650rpx;
        height: 60rpx;
        margin: 0 auto;
        background-color: #00aaee;
        border-radius: 20rpx;
        line-height: 60rpx;
        margin-top: 30rpx;
        display: flex;
        color: #ffffff;
        font-size: 24rpx;
        justify-content: space-between;
        padding-left: 20rpx;
        padding-right: 20rpx;
        box-sizing: border-box;
    }
    .order_bottom>view>text{
        font-size: 30rpx;
        color: #ffd200;
        font-weight: bold;
    }

    .btn-box{
        width: 40rpx;
        margin: 30rpx auto 0 auto;
    }
</style>
