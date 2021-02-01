<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">工作台</block>
		</custom>
		<view class="cu-bar bg-white margin-top solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>水洗唛扫码工作台
			</view>
		</view>
		<view class="cu-list grid col-3">
			<view @tap="scanCode('qingxi')" class="cu-item">
				<view class="cuIcon-clothes text-red"></view>
				<text>清洗</text>
			</view>
			<view @tap="scanCode('dabao')" class="cu-item">
				<view class="cuIcon-present text-orange"></view>
				<text>打包</text>
			</view>
			<view @tap="scanCode('fanxi')" class="cu-item">
				<view class="cuIcon-forward text-yellow"></view>
				<text>返洗</text>
			</view>
			<view @tap="scanCode('dayin')" class="cu-item">
				<view class="cuIcon-punch text-olive"></view>
				<text>打印</text>
			</view>
			<view @tap="showModal" data-target="printBox" class="cu-item">
				<view class="cuIcon-camerarotate text-mauve"></view>
				<text>换打印机</text>
			</view>
			<view @tap="scanCode('ruku')" class="cu-item">
				<view class="cuIcon-down text-green"></view>
				<text>入库</text>
			</view>
			<view @tap="scanCode('chuku')" class="cu-item">
				<view class="cuIcon-down rotate180 text-cyan"></view>
				<text>出库</text>
			</view>
			<view @tap="stockLog" class="cu-item">
				<view class="cuIcon-text text-blue"></view>
				<text>查询记录</text>
			</view>
			<view @tap="navTo('../worker/store')" class="cu-item">
				<view class="cuIcon-shop text-purple"></view>
				<text>门店</text>
			</view>
		</view>
		
		
		<view class="cu-modal" :class="modalName=='stockLog'?'show':''" @tap="hideModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">出入库记录</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-bottom">
					<view class="text-center padding">{{code}}<text v-if="orderLog.store_name" class="text-red">[{{orderLog.store_name}}]</text></view>
					<scroll-view class="log-box padding-lr">
						<view v-if="orderLog.qingxi" class="log-item flex justify-between">
							<view>[清洗]{{orderLog.qingxi}}</view>
							<view>{{u.timeToStr(orderLog.qingxi_time,'yy-MM-dd hh:mm')}}</view>
						</view>
						<view v-if="orderLog.dabao" class="log-item flex justify-between">
							<view>[打包]{{orderLog.dabao}}</view>
							<view>{{u.timeToStr(orderLog.dabao_time,'yy-MM-dd hh:mm')}}</view>
						</view>
						<view v-if="orderLog.fanxi" class="log-item flex justify-between">
							<view>[返洗]{{orderLog.fanxi}}[{{orderLog.fanxi_num}}]</view>
							<view>{{u.timeToStr(orderLog.fanxi_time,'yy-MM-dd hh:mm')}}</view>
						</view>
						<view v-for="(item,index) in logList" :key="index" class="log-item flex justify-between">
							<view>[{{item.type==1?'出库':'入库'}}]{{item.manage_name}}-{{item.store_name}}</view>
							<view>{{u.timeToStr(item.add_time,'yy-MM-dd hh:mm')}}</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="modalName=='printBox'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="printChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in printList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item}}</view>
								<radio class="round" :value="index"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<loginbox :loginBoxShow.sync="loginBoxShow"></loginbox>
	</view>
</template>

<script>
	const app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				modalName:null,
				loginBoxShow:0,
				logList:[],
				orderLog:{},
				code:"",
				printList:[],
				u:u
			};
		},
		onLoad() {
			setTimeout(()=>{
				app.globalData.login(()=>{},1)
			},1000)
			this.getPrint()
		},
		methods:{
			scanCode(type){
				uni.scanCode({
				    success: (res)=>{
						console.log(res)
						u.request({
							url:"worker/other_sao_code",
							data:{
								code:res.result,
								type:type,
							},
							success:(res)=>{
								uni.showToast({
									title:res.msg
								})
							}
						})
				    },
					fail(res) {
						console.log(res)
						uni.showToast({
							title:"扫码失败！",
							icon:"none"
						})
						// u.request({
						// 	url:"worker/other_sao_code",
						// 	data:{
						// 		code:"261922873",
						// 		type:type,
						// 	},
						// 	success:(res)=>{
						// 		uni.showToast({
						// 			title:res.msg
						// 		})
						// 	}
						// })
					}
				});
			},
			stockLog(){
				uni.scanCode({
				    success: (res)=>{
						this.code = res.result
						console.log(res.result)
						u.request({
							url:"worker/stock_log",
							data:{
								code:res.result,
							},
							success:(res)=>{
								this.modalName = 'stockLog'
								this.logList = res.inventory
								this.orderLog = res.order_log||{}
							}
						})
				    },
					fail:(res)=>{
						// u.request({
						// 	url:"worker/stock_log",
						// 	data:{
						// 		code:"261922873",
						// 	},
						// 	success:(res)=>{
						// 		this.modalName = 'stockLog'
						// 		this.logList = res.inventory
						// 		this.orderLog = res.order_log||{}
						// 	}
						// })
					}
				});
			},
			getPrint(){
				u.request({
					url:"worker/get_config",
					success:(res)=>{
						this.printList = res.config.print
					}
				})
			},
			printChange(e){
				u.request({
					url:"worker/bind_print",
					data:{
						print_no:e.detail.value
					},
					success:(res)=>{
						this.hideModal()
					}
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style lang="less">
.rotate180{
	display: block;
	transform:rotate(180deg);
}

.log-box{
	max-height: 600rpx;
	line-height: 1.6;
}
</style>
