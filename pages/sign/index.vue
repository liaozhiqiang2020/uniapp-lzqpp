<template>
	<view class="signBox">
		<view class="cu-list menu border" :class="[menuBorder ? 'sm-border' : '']">
			<view class="cu-item" :class="menuArrow ? '' : ''">
				<view class="content">
					<!-- <text class="text-color">切换场地</text> -->
					<text class="text-color">所属场地</text>
				</view>
				<view class="action">
					<!-- <picker @change="PickerChange" :range-key="'address'" :value="index" :range="picker">
						<view class="picker" :style="{'color': (index>-1 ? '':'#999999')}">
							{{index>-1?picker[index].address:'请选择场地'}}
						</view>
					</picker> -->
					<view class="picker" :style="{'color':''}">
						{{address}}
					</view>
				</view>
				<!-- <view>
					<text class="text-grey text-sm cuIcon-unfold"></text>
				</view> -->
			</view>
		</view>
		<view class="contentBox cu-list menu" :class="[menuBorder ? 'sm-border' : '']">
			<view class="bottomContent cu-item" @click="sign(item)" v-for="(item,index) in list" :key="index" :class="menuArrow ? 'arrow' : ''" >
				<view class="contentLeft">
					<text>{{item.name}}</text>
					<text class="date">{{item.registrTime}}</text>
				</view>
				<view>
					<text class="text-grey text-sm"></text>
				</view>
			</view>
		</view>
		<noData v-if="list.length == 0"></noData>
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
	</view>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {

		},
		data() {

			return {
				menuBorder: true,
				menuArrow: true,
				menuCard: true,
				index: -1,
				picker: [],
				loadModal:true,
				formData:{},
				list:[],
				address:''
			}
		},
		onLoad() {
				this.addr()
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
			/* 签到 */
			sign(val) {
				uni.navigateTo({
					url: "/pages/sign/datil?id="+val.id+"&chargeType="+val.chargeType+"&stuName="+val.name
				});
			},
			PickerChange(e) {
				this.index = e.detail.value
				this.formData = this.picker[this.index]
				this.loadModal = true
				this.onloadList(this.formData.id)
			},
			/* 查询地点 */
			addr() {
				var phone = wx.getStorageSync("phoneNumber")
				// this.$http
				// 	.testPost('/weixin/queryPlaces')
				// 	.then(res => {
				// 		this.loadModal = false
				// 		this.picker = res.data
				// 		this.onloadList(this.picker[0].id)
				// 	})
				// 	.catch(err => {
				// 		this.loadModal = false;
				// 	});
				this.$http
					.testPost('/weixin/findExistCoach/'+phone)
					.then(res => {
							this.loadModal = false
							this.address = res.data.placeName
							// console.log(res.data.placeId)
							this.onloadList(res.data.placeId)
						})
						.catch(err => {
							this.loadModal = false;
						});
			},
			/* 查询列表 */
			onloadList(val) {
				this.$http
					.testPost('/weixin/queryStudentByPlace/' +val)
					.then(res => {
						this.loadModal = false
						this.list = res.data
						console.log(res.data);
					})
					.catch(err => {
						this.loadModal = false;
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.signBox {
		.cu-list {
			width: 100%;
		
			// border-radius: 2upx;
			// box-shadow: 0px 14upx 16upx 0px rgba(43, 102, 253, 0.07);
			.cu-item {
				border-bottom: 1rpx solid #fff;
			}
		
			.text-color {
				font-size: 30upx;
				color: #4d4d4d;
			}
		
			.iconSize {
				font-size: 40upx;
				position: relative;
				top: 7upx;
			}
		}
	}
	.bottomContent {
		height: 110rpx;
		border-bottom: 2rpx solid rgba(242, 242, 242, 1);
		padding: 0 29rpx 0 29rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.border{
		border-bottom: 5rpx solid rgba(242, 242, 242, 1);
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
	.cu-list+.cu-list{
		margin-top:0;
	}
	.action{
		width: 72%;
		height: 100%;
	}
</style>
