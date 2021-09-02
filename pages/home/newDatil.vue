<template>
	<view class="newDatil padding">
		   <view class="title text-bold text-black">{{ noticeInfo.nickName }}</view>
		   <view class="date">
			 {{ noticeInfo.publishDate }}
		   </view>
		   <view class="content text-black">
			  <text>{{ noticeInfo.reward }}</text>
		   </view>
		   <image :src="baseUrl+noticeInfo.imgUrl" mode="widthFix"></image>
		   
	</view>
</template>

<script>
	const baseUrl = require('@/common/vmeitime-http');
	export default {
		data() {
			return {
				noticeInfo: {},
				baseUrl: baseUrl.baseUrl,
			}
		},
		onLoad(options) {
			uni.setNavigationBarColor({
			    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
			    backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
			    animation: {  //动画效果
			        duration: 100,
			        timingFunc: 'easeIn'
			    }
			})
			
			if(options.noticeInfo){
				this.noticeInfo = JSON.parse(options.noticeInfo);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.newDatil{
		.background{
			position: fixed;
			width: 100vw;
			height: 100vh;
			background-size: 100% 100%;
		}
		view{
			width: 100%;
		}
		.title{
			font-size: 32upx;
			}
			.date{
				text-align: right;
				font-size: 20upx;
				color:#999999;
				margin-top: 10upx;
			}
			.content{
				margin-top: 20upx;
				font-size: 24upx;
			}
			image{
				width: 100%;
				margin-top: 10upx;
				// height: auto;
			}
	}
		
</style>
