<template>
	<view v-if="loginBoxShow" class="login-box" @click="hideBox">
		<view v-if="step==1" @click.stop class="getUserInfo">
			<view class="login-title">微信快捷登入</view>
			<button open-type="getUserInfo" @getuserinfo="getUserInfo">授权登入</button>
		</view>
		<view v-if="step==2" @click.stop class="getPhoneNumber">
			<view class="login-title">微信快捷登入</view>
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">验证手机号</button>
		</view>
	</view>
</template>

<script>
	let app
	const u = require("../../utils/common.js")
	export default {
		data() {
			return {
				step:1,
			};
		},
		props: {
			loginBoxShow: {
				type: [Boolean],
				default: false
			},
		},
		methods:{
			getUserInfo(e){
				app = getApp()
				this.encryptedData = e.detail.encryptedData
				this.iv = e.detail.iv
				this.session_key = app.globalData.session_key
				uni.login({
					provider: 'weixin',
					success: (loginRes)=>{
						var code = loginRes.code
						//登入检查
						u.request({
						    url: 'user/wx_app_login', //仅为示例，并非真实接口地址。
						    data: {
						        code: code,
						    },
							success: (res) => {
								app.globalData.user_info = res.user_info
								app.globalData.user_token = res.user_info.user_token
								
								
								while (app.globalData.login_fn.length > 0) {
								    app.globalData.login_fn.pop()(res.user_info)
								}
								app.globalData.login_fn = []
								//app.globalData.login_fn&&app.globalData.login_fn(res)
								this.hideBox()
							},
							fail:(res)=>{
								this.session_key = res.session_key
								this.step = 2
							}
						});
					}
				});
			},
			getPhoneNumber(e){
				u.request({
					url:"user/get_wxapp_phone",
					data:{
						encryptedData:e.detail.encryptedData,
						iv:e.detail.iv,
						session_key:this.session_key
					},
					success:(res)=>{
						this.phone = res.info.phoneNumber
						this.reg()
					}
				})
			},
			reg(){
				u.request({
					url:"user/wx_app_reg",
					data:{
						encryptedData:this.encryptedData,
						iv:this.iv,
						session_key:this.session_key,
						phone:this.phone,
						inviter_id: app.globalData.scene.inviter_id,
					},
					success:(res)=>{
						this.hideBox()
						app.globalData.login(app.globalData.login_fn)
					}
				})
			},
			hideBox(){
				this.$emit('update:loginBoxShow', 0) 
			}
		}
	}
</script>

<style lang="less">
	.login-box{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 4000;
		background-color: rgba(0,0,0,.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.login-title{
		text-align: center;
		font-size: 32rpx;
		padding: 20rpx;
		border-bottom: solid #ccc 1rpx;
	}
	.getUserInfo,.getPhoneNumber{
		position: relative;
		width: 500rpx;
		background-color: #fff;
		border-radius: 10rpx;
		button{
			//position: absolute;
			font-size: 36rpx;
			background-color: #1aad19;
			color: #fff;
			margin: 20rpx;
		}
	}
	
</style>
