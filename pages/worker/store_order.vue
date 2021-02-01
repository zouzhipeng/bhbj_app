<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{store_info.store_name}}</block>
		</custom>
		<view class="padding-lr">
			<view @tap="stockLog(item.order_code)" v-for="(item,index) in order_list" :key="index" class="bg-white margin-top padding-lr padding-tb-xs flex justify-between align-center shadow round ">
				<view>{{item.order_code}}<text v-if="item.inventory_store_id" class="text-green">[{{item.inventory_store_name}}]</text></view>
				<view class="action">
					{{u.timeToStr(item.add_time)}}
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="modalName=='stockLog'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">出入库记录</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-bottom">
					<view class="text-center padding">{{code}}</view>
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
	</view>
</template>

<script>
	let app = getApp()
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				store_info:{},
				order_list:[],
				page:1,
				page_size:20,
				u:u,
				modalName:null,
				logList:[],
				orderLog:{},
			}
		},
		onLoad(p) {
			if(!p.store_id){
				this.BackPage()
			}
			this.store_id = p.store_id
			this.getCodeOrder()
			this.getStoreinfo()
		},
		onReachBottom() {
			this.page++;
			this.getCodeOrder()
		},
		methods: {
			
			getStoreinfo(fn){
				u.request({
					url:"store/get_info",
					data:{
						store_id:this.store_id,
					},
					passloading:1,
					success:(res)=>{
						this.store_info = res.info
						fn&&fn()
					}
				})
			},
			getCodeOrder(fn){
				u.request({
					url:"store/get_code_order",
					data:{
						page:this.page,
						page_size:this.page_size,
						where:JSON.stringify({store_id:this.store_id})
					},
					success:(res)=>{
						this.order_list = this.order_list.concat(res.list)
						fn&&fn()
					}
				})
			},
			
			stockLog(code){
				u.request({
					url:"worker/stock_log",
					data:{
						code:code,
					},
					success:(res)=>{
						this.modalName = 'stockLog'
						this.logList = res.inventory
						this.orderLog = res.order_log||{}
					}
				})
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>

</style>
