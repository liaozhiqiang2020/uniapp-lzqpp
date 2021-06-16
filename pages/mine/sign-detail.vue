<template>
	<view class="warp">
		<!-- <view class="box">
            <t-table @change="change">
                <t-tr>
                    <t-th>学员名</t-th>
                    <t-th>课程</t-th>
                    <t-th>签到时间</t-th>
                    <t-th>本节价格</t-th>
                </t-tr>
                <t-tr v-for="(item,index) in tableList" :key="index">
                    <t-td>{{ item.studentName }}</t-td>
                    <t-td>{{ item.courseName }}</t-td>
                    <t-td>{{ item.signTime }}</t-td>
                    <t-td>{{ item.money }}</t-td>
                </t-tr>
            </t-table>
        </view> -->

		<view class="contentBox">
			<view class="bottomContent" v-for="(item,index) in tableList" :key="index">
				<view class="contentLeft">
					<text>{{item.studentName}}</text>
					<text class="date">{{item.signTime}}</text>
				</view>
				<view class="contentRight">
					<text>{{item.courseName}}</text>
					<text>{{item.money}}</text>
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
				themeList: this.$mConstDataConfig.themeList,
				tableList: [], //数据列表
				loadModal: false, //加载列表
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
			/* 列表 */
			getList() {
				var phone = wx.getStorageSync("phoneNumber")
				this.$http
					.testPost('/weixin/findClassRecordByPhone/' + phone)
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
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		margin-top: -3rpx;
	}

	.bottomContent .contentLeft .date {
		font-size: 22rpx;
		color: rgba(167, 167, 167, 1);
		margin-top: 3rpx;
	}

	.bottomContent .contentRight {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.bottomContent .contentRight text {
		font-size: 26rpx;
		font-family: Microsoft YaHei;
		font-weight: 400;
		text-align: right;
		// color:rgba(167,167,167,1);
	}
</style>
