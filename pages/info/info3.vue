<template>

	<view class="homeBox">
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color"
			v-if="loadModal" />

		<!-- <hx-navbar :config="config" /> -->

		<!-- <ss-scroll-navbar :tabCurrentIndex="currentIndex" @navbarTap="navbarTapHandler" :navArr='navList'> -->
		<ss-scroll-navbar :tabCurrentIndex="currentIndex" :navArr='navList'>
		</ss-scroll-navbar>

		<uni-list :class="{ 'uni-list--waterfall': options.waterfall }">
			<!-- 通过 uni-list--waterfall 类决定页面布局方向 -->
			<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
			<uni-list-item :border="!options.waterfall" class="uni-list-item--waterfall" title="自定义商品列表"
				v-for="(item,index) in goods" :key="index">
				<!-- 通过body插槽定义商品布局 -->
				<view slot="body" class="shop">
					<view style="display: flex;flex-direction:row;margin: 0 auto;">
						<view class="shop-title">
							<text>{{item.studentName}}</text>
						</view>
						<view class="shop-price">
							<text :class="'text-' + themeColor.name">{{item.courseName}}</text>
						</view>
						<view class="shop-price">
							<text :class="'text-' + themeColor.name">{{item.startTime}}-{{item.endTime}}</text>
						</view>
						<view class="shop-title" @click.stop="btnDelete(item.id)">
						  <image src="../../static/img/shanchu.png" style="height: 50rpx;width: 50rpx;display: block;"></image>
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<noData v-if="goods.length == 0"></noData>

	</view>


</template>

<script>
	const baseUrl = require('@/common/vmeitime-http');
	import ssScrollNavbar from '@/components/ss-scroll-navbar/ss-scroll-navbar2';
	import hxNavbar from '@/components/hx-navbar/hx-navbar';
	import {
		mapState,
		mapMutations
	}
	from 'vuex';

	export default {
		components: {
			ssScrollNavbar,
			hxNavbar
		},
		data() {
			return {
				loadModal: false, //加载
				baseUrl: baseUrl.baseUrl,
				themeList: this.$mConstDataConfig.themeList,
				navList: [], //导航列表
				swiperBj: require('../../static/swiper-rf.png'),
				config: {
					//顶部导航栏参数
					title: '课程表',
					color: '#ffffff',
					fontSize: '16px',
					isShow: false,
					back: false,
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					backgroundColor: [1, ['#642B8D', '#642B8D', '#642B8D', '#642B8D']]
				},
				goods: [], //商品类表
				goodNum: 1, //默认数量
				currentIndex: 0,
				// currentIndex1: 0,
			}
		},
		onLoad() {
			// this.loadModal = true
			// this.getGoods(this.getWeekDate())
			uni.setNavigationBarColor({
				frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
				backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
				animation: { //动画效果
					duration: 100,
					timingFunc: 'easeIn'
				}
			})
		},
		onShow() { //tab页加载
			if (!uni.getStorageSync("phoneNumber")) {
				uni.navigateTo({
					url: "/pages/phoneNumber/index"
				})
			} else {
				this.loadModal = true
				this.getGoods(this.getWeekDate())
				this.phone = uni.getStorageSync("phoneNumber")
			}

		},
		methods: {
			getWeekDate() {
				var now = new Date();
				var day = now.getDay();
				var weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
				var week = weeks[day];
				this.currentIndex = day;
				this.navList = [week];
				return week;
			},
			// navbarTapHandler(index) {
			// 	this.currentIndex = index;
			// 	this.getGoods(this.navList[index])	
			// },

			/* 课程列表 */
			getGoods(val) {
				var phone = wx.getStorageSync("phoneNumber")
				this.$http
					.testPost('/weixin/findRealClassByPhone/' + phone + '/' + val)
					.then(res => {
						this.loadModal = false
						if (res.data.code = 200) {
							console.log(res.data)
							this.goods = res.data

						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			btnDelete(chooseId) {
			  console.log(chooseId);
			  let that = this;
			  uni.showModal({
			    title:'提示',
			    content:'确定要删除吗？',
			    success:function(res){
			      if(res.confirm){
			        // console.log('点击删除');
			        that.$http
			          .testPost('/weixin/deleteRealClassById/'+chooseId)
			          .then(res2 => {
			            that.loadModal = true
			            that.getGoods(that.getWeekDate())
			          })
			          .catch(err => {
			            that.loadModal = false;
			          });
			      }else{
			        console.log('点击取消');
			      }
			    }
			  })
			},
		}
	}
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
</style>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}


	.shop {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}


	.shop-title {
		// margin-top: 5px;
		font-size: 32upx;
		// color: #ff5a5f;
		margin-right: 10px;
	}

	.shop-price {
		// margin-top: 5px;
		font-size: 32upx;
		color: #ff5a5f;
		margin-right: 10px;
	}



	// 默认加入 scoped ，所以外面加一层提升权重
	.list {
		.uni-list--waterfall {

			/* #ifndef H5 || APP-VUE */
			// 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
			/deep/ .uni-list {
				/* #endif */
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 5px;
				box-sizing: border-box;

				/* #ifdef H5 || APP-VUE */
				// h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
				/deep/
				/* #endif */
				.uni-list-item--waterfall {
					width: 50%;
					box-sizing: border-box;

					.uni-list-item__container {
						padding: 5px;
						flex-direction: column;
					}
				}

				/* #ifndef H5 || APP-VUE */
			}

			/* #endif */
		}
	}
</style>