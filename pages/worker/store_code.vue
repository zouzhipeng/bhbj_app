<template>
	<view>
		<custom bgColor="bg-main" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{store_info.store_name}}</block>
		</custom>
		<view class="padding-lr">
			<view v-for="(item,index) in code_list" :key="index" class="bg-white margin-top padding-lr padding-tb-xs flex justify-between align-center shadow round ">
				{{item.code_begin}}-{{item.code_end}}
				<view class="action text-xl">
					<text @tap="removeCode(item.code_id)" class="cuIcon-roundclosefill text-red"></text>
				</view>
			</view>
		</view>
		<view class="padding">
			<button @tap="showModal" data-target="codeBox" class="cu-btn block bg-green">
				<text class="cuIcon-add"></text>
				添加水洗唛编号
			</button>
		</view>
		
		<view class="cu-modal" :class="modalName=='codeBox'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">导入水洗唛编号</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-tb text-left">
					<view class="text-red padding-lr">*输入水洗唛开始和结束的9位数字</view>
					<form>
						<view class="cu-form-group">
							<view class="title">开始号码</view>
							<input v-model="code_data.code_begin" placeholder="水洗唛开始编号" name="input" type="number" maxlength="9"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">结束号码</view>
							<input v-model="code_data.code_end" placeholder="水洗唛结束编号" name="input" type="number" maxlength="9"></input>
						</view>
					</form>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="addCode">确定</button>
					</view>
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
				code_list:[],
				modalName:"",
				code_data:{
					code_begin:"",
					code_end:"",
				}
			};
		},
		onLoad(p) {
			if(!p.store_id){
				this.BackPage()
			}
			this.store_id = p.store_id
			this.getStoreCode()
			this.getStoreinfo()
		},
		methods:{
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
			getStoreCode(fn){
				u.request({
					url:"store/get_code_list",
					data:{
						store_id:this.store_id,
					},
					success:(res)=>{
						this.code_list = res.list
						fn&&fn()
					}
				})
			},
			addCode(){
				this.code_data.store_id = this.store_id
				u.request({
					url:"store/add_code",
					data:this.code_data,
					success:(res)=>{
						this.getStoreCode()
						this.hideModal()
						this.code_data.code_begin = ""
						this.code_data.code_end = ""
					}
				})
			},
			removeCode(code_id){
				uni.showModal({
					title:"确认移除？",
					success:(res)=>{
						if(res.confirm){
							u.request({
								url:"store/remove_code",
								data:{
									code_id:code_id,
								},
								success:(res)=>{
									this.getStoreCode()
								}
							})
						}
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

</style>
