<template>
	<view class="warp">
		<view class="contentBox">
			<view class="bottomContent" v-for="(item,index) in tableList" :key="index">
				<view class="contentLeft">
					<text>{{item.studentName}}</text>
					<text class="date">{{item.courseName}}</text>
				</view>
				<view class="contentRight">
					<text>{{item.money}}元</text>
					<text class="description">{{item.signTime}}</text>
				</view>
			</view>
		</view>
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
		<noData v-if="tableList.length == 0"></noData>
	</view>
</template>

<script>
import { mapState ,mapMutations} from 'vuex';
	export default {
		components: {

		},
		data() {
			return {
				tableList: [], //数据列表
				loadModal: false, //加载列表
				themeList: this.$mConstDataConfig.themeList,
			}
		},
		onLoad() {
			this.loadModal = true
			this.getList()
			uni.setNavigationBarColor({
			    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
			    backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
			    animation: {  //动画效果
			        duration: 100,
			        timingFunc: 'easeIn'
			    }
			})
		},
		methods: {
			change(e) {
				// console.log(e.detail);
			},
			edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			},
			/* 列表 */
			getList() {
				var phone = wx.getStorageSync("phoneNumber")
				this.$http
					.testPost('/weixin/coachFindSignDetails/' + phone)
					.then(res => {
						this.loadModal = false
						if (res.data.code = 200) {
							this.tableList = res.data
						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						// uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.contentBox {}

	.bottomContent {
		height: 110rpx;
		border-bottom: 2rpx solid rgba(242, 242, 242, 1);
		padding: 0 29rpx 0 29rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bottomContent .contentLeft {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.bottomContent .contentLeft text {
		font-size: 28rpx;
		font-weight: bold;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		margin-top: -3rpx;
	}

	.bottomContent .contentLeft .date {
		font-size: 22rpx;
		font-weight: 500;
		// color: rgba(167, 167, 167, 1);
		margin-top: 3rpx;
	}

	.bottomContent .contentRight {
		display: flex;
		flex-direction: column;
		justify-content: center;
		.description {
			color: rgba(167, 167, 167, 1);
			font-size: 22rpx;
			font-weight: 400;
		}
	}

	.bottomContent .contentRight text {
		font-size: 28rpx;
		font-family: Microsoft YaHei;
		font-weight: 400;
		text-align: right;
		// font-weight: bold;
		// color:rgba(167,167,167,1);
	}
</style>
