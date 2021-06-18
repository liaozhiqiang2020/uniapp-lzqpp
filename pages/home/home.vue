<template>
	<view class="homeBox">
		<hx-navbar :config="config" />
		<view class="swiperBox">
			<view class="swiperBj" :style="{ backgroundImage: 'url(' + swiperBj + ')' }"></view>
			<swiper
				style="border-radius: 10upx;width: 94%;margin-left: 3%;margin-top:10upx;height: 425upx;overflow: hidden;"
				class="screen-swiper" :class="dotStyle ? 'square-dot' : 'round-dot'" :indicator-dots="true"
				:circular="true" :autoplay="true" interval="5000" duration="500">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<image style="border-radius: 10upx" :src="baseUrl+item.imgUrl" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<sh-menu :detail="menuList" :imgW="110" :menu="menu"></sh-menu>
		<view class="index solids-top">
			<view class="box">
				<view class="cu-bar bg-white">
					<view class="action text-black text-bold">
						新闻资讯
					</view>
				</view>
			</view>
			<view class="Layout LayoutLjflzn LayoutJrrd bg-white padding-lr">
				<view class="solids-bottom flex align-center contentBox" v-for="(item, index) in newslist" :key="index" @click="datil(item)">
					<image :src="baseUrl+item.imgUrl" mode="aspectFill"></image>
					<view class="content">
						<view class="title text-bold text-black">{{ item.nickName }}</view>
						<view class="desc">{{ item.reward }}</view>
						<view class="date">{{ item.publishDate }}</view>
					</view>
				</view>
				<view class="solids-bottom flex align-center contentBox" v-if="newslist.length == 0">
					<view style="text-align: center; width:100%" class="title text-bold text-black">暂无内容</view>
				</view>
			</view>
		</view>
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
	</view>
</template>

<script>
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/mmmm-image-tools/index.js';
	import shMenu from '@/components/sh-menu.vue';
	import hxNavbar from '@/components/hx-navbar/hx-navbar';
	const baseUrl = require('@/common/vmeitime-http');
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				themeList: this.$mConstDataConfig.themeList,
				config: {
					//顶部导航栏参数
					title: '零之启',
					color: '#ffffff',
					fontSize: '14px',
					isShow:true,
					back: false,
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					backgroundColor: [1, ['#642B8D', '#642B8D', '#642B8D', '#642B8D']]
				},
				swiperList: [],
				dotStyle: true,
				swiperBj: require('../../static/swiper-rf.png'),
				// swiperBj: require('../../static/swiper-'+this.themeColor.name+'.png'),
				queryReportProvinceList: [],
				newslist: [], // 新闻列表
				baseUrl: baseUrl.baseUrl,
				loadModal: false, //加载
				menuList: [], //菜单列表
				menu:3,
			};
		},
		components: {
			hxNavbar,
			shMenu,
		},
		computed: {
			...mapState(['userInfo', 'hasLogin'])
		},
		onLoad() {
			this.loadModal = true
		},
		onShow() {
			var imgUrl = '../../static/swiper-rf.png'
			this.swiperBj = require('../../static/swiper-'+this.themeColor.name+'.png')
			this.queryCarouselImg()
			this.getMenu()
			this.getNews()
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
		onPullDownRefresh() {
			this.queryCarouselImg()
			this.getMenu()
			this.getNews()
		},
		onHide() {

		},
		methods: {
			onPress(e){
			        console.log(e)
			    },
			/* 轮播图 */
			queryCarouselImg() {
				this.$http
					.testGet('/weixin/findGongGaoNotice/4')
					.then(res => {
						this.loadModal = false
						uni.stopPullDownRefresh();
						if (res.data.code = 200) {
							this.swiperList = res.data;
						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			/* 菜单 */
			getMenu() {
				var phone = wx.getStorageSync("phoneNumber")
				if(phone==""){
					phone="null";
				}
				this.$http
					.testPost('/weixin/findAllBtnMenuByTel/'+phone)
					.then(res => {
						this.loadModal = false
						uni.stopPullDownRefresh();
						if (res.data.code = 200) {
							this.menuList = res.data
						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			/* 新闻资讯 */
			getNews() {
				this.$http
					.testPost('/weixin/findGongGaoNotice/1')
					.then(res => {
						this.loadModal = false
						uni.stopPullDownRefresh();
						if (res.data.code = 200) {
							this.newslist = res.data
						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			/* 跳转详情 */
			datil(item){
				 var noticeInfo = JSON.stringify(item);
				  wx.navigateTo({
					url:"/pages/home/newDatil?noticeInfo="+noticeInfo
				  })
			},

		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
	}

	.homeBox {
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// width: 100vw;
		// justify-content: center;
		// padding-bottom: 40upx;
	}

	.cu-list {
		width: 100%;
		margin-top: 10upx;
		background: #379d51;
		border-radius: 10upx;
		/*  #ifdef  MP-WEIXIN  */
		// margin-top: 100upx;
		/*  #endif  */
		color: #ffffff;

		.cu-item {
			background: none;
		}

		.text-color {
			font-size: 30upx;
			color: #ffffff;
		}
	}

	.cu-list.menu>.cu-item.arrow:before {
		color: #ffffff;
	}

	.swiperBox {
		width: 100%;

		.swiperBj {
			width: 100vw;
			position: absolute;
			left: 0;
			background-size: 100% 100%;
			margin-top: 30upx;
			top: var(--status-bar-height);
			z-index: 0;
			height: 210upx;
		}

		.swiper {
			width: 92vw;
			margin-top: 10upx;
		}
	}


	.Layout {
		position: relative;
		z-index: 10;
		width: 100vw;
		/*  #ifdef  MP-WEIXIN  */
		// margin-top: 80upx;
		/*  #endif  */
	}

	.LayoutLjflzn {
		/*  #ifdef  MP-WEIXIN  */
		margin-top: 0upx;
		/*  #endif  */
	}

	.LayoutJrrd {
			margin-top:-15upx;
		.contentBox {
			display: flex;
			// height: 230upx;
			padding:15upx 0;
			justify-content: space-between;
		}

		image {
			width: 220upx;
			height: 220upx;
		}

		.content {
			width: 450upx;
			height: 230upx;
			position: relative;

			.title {
				height: 36upx;
				font-size: 30upx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin: 0 0 15upx 0;
			}

			.desc {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
				max-height: 115upx;
				color: #999999;
				font-size: 26upx;
				width: 100%;
			}

			.date {
				// font-size: 24upx;
				color: #3a3838;
				position: absolute;
				right: 5upx;
				// margin-top: 10upx;
				bottom: 15upx;
				font-size: 22upx;
			}
		}

		.index {
			margin-top: 15upx;
			padding-top: 15upx;

			.box {
				width: 100vw;
				margin-top: 0upx;
				font-size: 36upx;
				position: relative;

				.cu-bar {
					min-height: auto !important;

					.lookMore {
						position: absolute;
						right: 30upx;
						font-size: 26upx;
						color: #000000;
					}
				}
			}
		}
	}
</style>
