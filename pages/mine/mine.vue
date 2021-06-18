<template>
	<view class="homeBox">
		<!-- <hx-navbar :config="config" /> -->
		<view class="padding">
			<view class="swiperBj" :style="{ backgroundImage: 'url(' + swiperBj + ')' }"></view>
			<view class="infoBox">
				<view class="av">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="name">
					<open-data class="name" type="userNickName"></open-data>
				</view>
			</view>
			<view class="cu-list menu margin-top" :class="[menuBorder ? 'sm-border' : '']">
				<view class="cu-item" :class="menuArrow ? 'arrow' : ''" @click="navTo({path:'/pages/mine/deposit'})">
					<view class="content">
						<text class="iconSize cuIcon-rechargefill" :style="{ color: '#259843'}"></text>
						<text class="text-color">充值</text>
					</view>
					<view class="action"><text class="text-grey text-sm"></text></view>
				</view>
			</view>

			<view class="cu-list menu" :class="[menuBorder ? 'sm-border' : '']">
				<view class="cu-item" :class="item.isRight ? 'arrow' : ''" @click="navTo(item)"
					v-for="(item,index) in list" :key="index">
					<view class="content">
						<text class="iconSize" :class="item.icon" :style="{ color: item.color}"></text>
						<text class="text-color">{{item.title}}</text>
					</view>
					<view class="action" v-if="item.num == ''"><text class="text-black text-bold">{{item.num}}</text></view>
					<view class="action" v-else><text class="text-black text-bold">{{item.num}}元</text></view>
				</view>
			</view>
			<view class="cu-list menu " :class="[menuBorder ? 'sm-border' : '']">
				<view class="cu-item" :class="menuArrow ? 'arrow' : ''" @click="serviceTelephone">
					<view class="content">
						<text class="iconSize cuIcon-dianhua" :style="{ color: '#475261'}"></text>
						<text class="text-color">联系客服</text>
					</view>
					<view class="action"><text class="text-grey text-sm"></text></view>
				</view>
				<view class="cu-item" :class="menuArrow ? 'arrow' : ''" @click="navTo({path:'/pages/mine/set'})">
					<view class="content">
						<text class="iconSize cuIcon-settingsfill" :style="{ color: '#475261'}"></text>
						<text class="text-color">设置</text>
					</view>
					<view class="action"><text class="text-grey text-sm"></text></view>
				</view>
			</view>
		</view>
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const baseUrl = require('@/common/vmeitime-http');
	import hxNavbar from '@/components/hx-navbar/hx-navbar';
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/mmmm-image-tools/index.js';
	export default {
		components: {
			hxNavbar
		},
		data() {
			return {
				themeList: this.$mConstDataConfig.themeList,
				menuBorder: true,
				menuArrow: true,
				menuCard: true,
				loadModal: false, //加载中
				swiperBj: require('../../static/swiper-rf.png'),
				config: {
					//顶部导航栏参数
					isShow: false,
					title: '我的',
					color: '#ffffff',
					fontSize: '14px',
					back: false,
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					backgroundColor: [0, ['#a9a1ff', '#6970ff', '#ff55ff', '#ff9999']]
				},
				list: [{
						num: "0",
						color: "orange",
						title: "剩余金额",
						path: "",
						icon: "cuIcon-moneybag",
						isRight: false
					},
					{
						num: "",
						color: "#b2bb2c",
						title: "上课记录",
						path: "/pages/mine/sign-detail",
						icon: "cuIcon-calendar",
						isRight: true
					},
					{
						num: "",
						color: "#aa67da",
						title: "缴费记录",
						path: "/pages/mine/tuition-detail",
						icon: "cuIcon-formfill",
						isRight: true
					},
					{
						num: "",
						color: "#999999",
						title: "消息通知",
						path: "/pages/mine/xiaoxi",
						icon: "cuIcon-noticefill",
						isRight: true
					},
					{
						num: "",
						color: "#2db93f",
						title: "推广返课",
						path: "",
						icon: "cuIcon-forwardfill",
						isRight: true
					}
				]
			};
		},
		computed: {
			...mapState(['userInfo', 'hasLogin'])
		},
		onShareAppMessage() {

		},
		onPullDownRefresh() {
			this.queryBalanceByPhone()
		},
		onShow() {
			this.swiperBj = require('../../static/swiper-'+this.themeColor.name+'.png')
			this.queryBalanceByPhone()
			uni.setTabBarStyle({
				selectedColor: this.themeColor.color,
				borderStyle: 'white'
			});
			this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
				uni.setTabBarItem({
					index,
					selectedIconPath
				});
			});
		},
		onLoad() {
			pathToBase64(this.swiperBj)
				.then(base64 => {
					this.swiperBj = base64;
				})
				.catch(error => {
					// console.error(error);
				});
			this.loadModal = true
		},
		methods: {
			/* 跳转页面 */
			navTo(item) {
				if (item.title == '推广返课') {
					this.share()
				}else if(item.path == '/pages/mine/deposit'){
					var phone = uni.getStorageSync("phoneNumber")
					this.$http
						.testPost('/weixin/findStudentByTel/' + phone)
						.then(res => {
							uni.stopPullDownRefresh();
							this.loadModal = false
							if(res.data==0){//没有学员
								uni.showModal({
									title: '提示',
									content: '请先联系教练进行报名！',
									showCancel: false
								})
							}else{
								uni.navigateTo({
									url: item.path
								});
							}	
						})
						.catch(err => {
							uni.stopPullDownRefresh();
							this.loadModal = false;
						});
						
				}
				 else {
					if(!uni.getStorageSync("phoneNumber")){
						uni.navigateTo({
							url:"/pages/phoneNumber/index"
						})
					}else{
						uni.navigateTo({
							url: item.path
						});
					}
					
				}
			},
			/* 查询余额 */
			queryBalanceByPhone() {
				var phone = wx.getStorageSync("phoneNumber")
				this.$http
					.testPost('/weixin/queryBalanceByPhone/' + phone)
					.then(res => {
						uni.stopPullDownRefresh();
						this.loadModal = false
						this.list[0].num = res.data
						// console.log(res.data)
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			/* 联系客服 */
			serviceTelephone() {
				uni.makePhoneCall({
					phoneNumber: '17805421508' //仅为示例
				});
			},
			share() {
				uni.showModal({
					title: '提示',
					content: '推广返课功能暂未开放！',
					showCancel: false
				})
			},

		},
	};
</script>

<style lang="scss" scoped>
	page {
		/*  #ifdef  H5  */
		background-color: #f9f8f8 !important;
		/*  #endif  */
		width: 100vw;
		overflow-x: hidden;
	}

	.homeBox {
		/*  #ifdef  !H5  */
		background-color: #f9f8f8 !important;
		min-height: 100vh;
		/*  #endif  */
		width: 100vw;
	}

	.swiperBj {
		width: 100vw;
		position: absolute;
		left: 0;
		background-size: 100% 100%;
		top: -10upx;
		/* background-position:left; */
		z-index: 0;
		height: 330upx;
		/*  #ifdef  MP-WEIXIN  */
		height: 380upx;
		/*  #endif  */
		/* z-index: -1; */
	}

	.infoBox {
		width: 100%;
		// height: 252upx;
		background: #ffffff;
		box-shadow: 0px 14upx 16upx 0px rgba(43, 102, 253, 0.07);
		border-radius: 14upx;
		position: relative;
		top: 180upx;
		// z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 0upx;

		.av {
			position: relative;
			width: 130upx;
			height: 130upx;
			overflow: hidden;
			top: -75upx;
			border-radius: 50%;
		}

		text {
			position: relative;
			top: -30upx;
		}

		.name {
			font-size: 34upx;
			color: #3e3e3e;
			font-weight: bold;
			position: relative;
			top: -20upx;
		}
	}

	.margin-top {
		margin-top: 210upx;
	}

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
</style>
