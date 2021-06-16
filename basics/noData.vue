<template>
	<view class="noData">
		<image src="../static/noData.png" mode=""></image>
		<text>暂无数据～</text>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.noData{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top:25%;
		image{
			width: 420upx;
			height: 310upx;
			margin:40upx 0 40upx -20upx;
		}
		text{
			font-size: 30upx;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #999999;
			margin-bottom: 20upx;
		}
	}
</style>
