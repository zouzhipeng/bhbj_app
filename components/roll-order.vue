<template>
	<view>
		<view class="roll-box text-white" :class="step==1?'fadeInUp':'fadeOutUp'" :style="{top:top+'rpx'}">
			<text class="cuIcon-notificationfill"></text>
			<image :src="info.headimgurl||'../static/img/default_img.jpg'" class="cu-avatar sm round margin-left-sm"></image>
			<text class="margin-left-sm">{{info.nickname}}购买了{{info.title}}</text>
		</view>
	</view>
</template>

<script>
	const u = require("../utils/common.js")
	export default {
		data() {
			return {
				step:2,
				info:{},
				list:[],
			};
		},
		props: {
			top: {
				type: Number,
				default: 80
			},
		},
		mounted() {
			this.show()
		},
		methods:{
			getList(fn){
				u.request({
					url:"index/roll_order_list",
					data:{
						page:this.page
					},
					passloading:1,
					success:(res)=>{
						this.list = res.list
						fn&&fn()
					}
				})
			},
			show(){
				if(this.list.length>0){
					this.info = this.list.shift()
					this.step = 1
					setTimeout(()=>{
						this.step = 2
						setTimeout(()=>{
							this.show()
						},500)
					},5000)
				}
				else{
					this.getList(()=>{
						this.show()
					})
				}
			}
		}
	}
</script>

<style lang="less">
	
.roll-box{
	position: fixed;
	top: 80rpx;
	left: 20rpx;
	background-color: rgba(0,0,0,0.5);
	border-radius: 100rpx;
	padding: 10rpx 20rpx;
	display: flex;
	align-items: center;
	z-index: 200;
}

.fadeInUp{
    animation-duration: .3s;
    animation-fill-mode: both;
    animation-name: fadeInUp;
}
.fadeOutUp{
    animation-duration: .3s;
    animation-fill-mode: both;
    animation-name: fadeOutUp;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 30%, 0);
    }

    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes fadeOutUp {
    from {
        opacity: 1;
        transform: none;
    }
    to {
        opacity: 0;
        transform: translate3d(0, -30%, 0);
    }
}
</style>
