<template>
	<!-- 获取一个数组，结构为[{date:'时间',info:'内容内容'}] -->
	<!-- @click事件返回点击标签元素的索引值 第一项为0 -->
	<view>
		<view class="bg" v-for="(item, indexs) in infoList" :key="indexs">
			<view class="steps">
				<view class="steps_item" >
					<view class="s_r">
						<view class="line" :style="{backgroundColor:indexs != 0?'rgba(0,0,0,0)':'rgba(0,0,0,0)'}"></view>
						<view class="index" :style="{backgroundColor:item.GetoffTime != null?activeBackgroundColor:backgroundColor,color:color}">
							上
						</view>
						<view class="line" :style="{backgroundColor:indexs != infoList.length-1?'rgba(0,0,0,0)':'rgba(0,0,0,0)'}"></view>
					</view>
					<view class="s_l">
						<view class="info_item">
							<text>{{ item.GetoffTime || '' }} {{ item.GetoffAddress || '暂无打卡记录' }}</text>
						</view>
					</view>
				</view>
				<view class="steps_item" >
					<view class="s_r">
						<view class="line" :style="{backgroundColor:indexs != 0?'rgba(0,0,0,0)':'rgba(0,0,0,0)'}"></view>
						<view class="index" :style="{backgroundColor:item.GotoTime != null?activeBackgroundColor:backgroundColor,color:color}">
							下
						</view>
						<view class="line" :style="{backgroundColor:indexs != infoList.length-1?'rgba(0,0,0,0)':'rgba(0,0,0,0)'}"></view>
					</view>
					<view class="s_l">
						<view class="info_item">
							<text>{{ item.GotoTime|| '' }} {{ item.GotoAddress || '暂无打卡记录'}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: 'YSteps',
		props: {
			infoList: {
				type: Array,
				default: []
			},
			color: {
				type: String,
				default: '#fff'
			},
			activeBackgroundColor: {
				type: String,
				default: '#379D51'
			},
			backgroundColor: {
				type: String,
				default: '#AAAAAA'
			},
			lineNum: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {};
		},
		onLoad(e) {
			//获取列表
		},
		methods: {
			topage(e) {
				this.$emit('click', e);
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.bg {
		padding: 20upx 0;
		background-color: #ffffff;
		display: flex;
		border-bottom:solid 2upx #F2F2F2;
	}

	.steps {
		display: flex;
		flex-direction: column;

		.steps_item {
			display: flex;

			.s_r {
				padding: 0 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
justify-content: center;
				.line {
					flex: 1;
					width: 5rpx;
					background-color: #fff;
				}

				.index {
					width: 50rpx;
					height: 50rpx;
					font-size: 28upx;
					text-align: center;
					line-height: 50rpx;
					border-radius: 50rpx;
				}
			}

			.s_l {
				display: flex;
				flex-direction: column;
				padding: 20rpx 0;

				.info_item {
					// background-color: #FFFFFF;
					margin-right: 30upx;
					border-radius: 10upx;
					display: flex;
					// flex-direction: column;
					justify-content: center;
					// padding: 30upx;
					// box-shadow: 0 10rpx 30rpx #ddd;

					text {
						font-size: 26upx;
						font-weight: 500;
						color: #333333;
					}
				}

				.info_item:active {
					background-color: #f4f4f4;
				}
			}
		}
	}

</style>
