<template>
	<view class="refresher">
		<!-- 这里的图片请换成自己项目的图片 -->
		<image class="refresher-image" mode="aspectFit" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3028672281,4280382655&fm=26&gp=0.jpg"></image>
		<text class="refresher-text">{{statusText}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		computed: {
			statusText(){
				var statusTextArr = ['哎呀，用点力继续下拉！','拉疼我啦，松手刷新~~','正在努力刷新中...']
				return statusTextArr[this.status];
			}
		},
		props: {
			status: {
				type: Number,
				default: function() {
					return 0;
				},
			},
		}
	}
</script>

<style scoped>
	.refresher{
		height: 100%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
	}
	.refresher-image{
		margin-top: 10rpx;
		height: 45px;
		width: 45px;
	}
	.refresher-text{
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #666666;
	}
</style>
