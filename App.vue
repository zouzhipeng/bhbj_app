<script>
	import Vue from 'vue'
	const u = require("utils/common.js")
	export default {
		onLaunch: function(p) {
			console.log('App Launch',p)
			if(p.query.scene){
				this.globalData.scene = u.decodeScene(p.query.scene)
			}
			if(p.query.inviter_id){
				this.globalData.scene.inviter_id = p.query.inviter_id
			}
			
			this.globalData.login(false,0)
			
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
			
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
			
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			
			
			//获取配置信息
			// u.request({
			// 	url:"index/get_config",
			// 	passloading:1,
			// 	success: (res) => {
			// 		this.globalData.wx_config = res.config
			// 	},
			// })
			
			Vue.prototype.navTo = (url)=>{
				uni.navigateTo({
					url:url
				})
			}
			
			//查看图片
			Vue.prototype.showImg = (url)=>{
				uni.previewImage({
					urls:[url],
					current:0
				})
			}
			
			Vue.prototype.BackPage = (url)=>{
				if(typeof url !== 'string') url = ""
				var pages = getCurrentPages();
				if(pages.length>1){
					uni.navigateBack({
						delta: 1
					});
				}
				else{
					uni.redirectTo({
						url:(url||"/pages/index/index")
					})
				}
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			//启动参数
			scene:{},
			//购物车
			cart:[],
			//cart:[{"id":3,"img":"http://cdn.yidaiquanxi.com/manage/202002061909162755.png","title":"59洗2件衣服","money":"59","num":1},{"id":2,"img":"http://cdn.yidaiquanxi.com/manage/202002061903523917.png","title":"69洗3件衣服","money":"69","num":1}],
			user_info: false,
			user_token: "",
			//登入
			login_fn:[],
			logining:false,
			login: function(fn,auto_show=1){
				if(this.user_info){
					fn&&fn(this.user_info)
					return
				}
				//多次触发登入则记录登入回调
				if(this.logining){
					fn&&this.login_fn.push(fn)
					return
				}
				//每次重新登入清空原有回调记录
				fn&&(this.login_fn = [fn])
				this.logining = true
				let page = getCurrentPages()
				page = page[page.length - 1]?page[page.length - 1].$vm:{}
				uni.getSetting({
					success: (res) => {
						let authStatus = res.authSetting['scope.userInfo'];
						if(authStatus){
							uni.login({
								provider: 'weixin',
								success: (loginRes)=>{
									var code = loginRes.code
									//登入检查
									u.request({
									    url: 'user/wx_app_login', //仅为示例，并非真实接口地址。
									    data: {
									        code: code,
									        inviter_id: this.scene.inviter_id,
									    },
									    success: (res) => {
									        this.user_info = res.user_info
									        this.user_token = res.user_info.user_token
											
											this.logining = false
											while (this.login_fn.length > 0) {
											    this.login_fn.pop()(res.user_info)
											}
											this.login_fn = []
											//this.login_fn&&this.login_fn(res)
									    },
										fail:(res)=>{
											this.logining = false
											//注册
											console.log('未注册',res);
											//授权
											if(auto_show){
												if(res.session_key){
													this.session_key = res.session_key
												}
												page.loginBoxShow = 1
											}
										}
									});
								}
							});
						}
						else{
							//授权
							if(auto_show){
								console.log('page:',getCurrentPages());
								page.loginBoxShow = 1
							}
							this.logining = false
						}
					}
				}) 
			},
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	@import url("./font/icon.css");
	@import url("./static/config.less");
	@import "colorui/main.css";
	@import "colorui/icon.css";
	
	page{
		background-color: #F8F8F8;
	}
	.flex-grow{
		flex-grow: 1;
	}
	.text-center{
		text-align: center;
	}
	// .text-red{
	// 	color: #FF6666;
	// }
	// .text-green{
	// 	color: #99CC66;
	// }
	.bg-main{
		background-color: @m_color;
	}
	.btn{
		height: 70rpx;
		line-height: 60rpx;
		font-size: 32rpx;
		padding: 5rpx 30rpx;
		background-color: @m_color;
		color: #fff;
	}
	
	.modal{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0,0,0,.5);
		.dialog{
			padding: 40rpx;
			background-color: #fff;
			border-radius: 20rpx;
		}
	}
	
	.poster-canvas{
		position: absolute;
		left: -1500px;
		top: 0px;
		width: 750px;
		height: 1000px;
		
		//transform:scale(.5);transform-origin:0% 0%;
	}
</style>
