<template>
		
		<view class="homeBox">
			<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
			
			<ss-scroll-navbar :tabCurrentIndex="currentIndex" @navbarTap="navbarTapHandler" :navArr='navList' style="text-align: center;">
			</ss-scroll-navbar>
			
			<uni-list :class="{ 'uni-list--waterfall': options.waterfall }">
				<!-- 通过 uni-list--waterfall 类决定页面布局方向 -->
				<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
				<uni-list-item :border="!options.waterfall" class="uni-list-item--waterfall" title="自定义商品列表"
					v-for="(item,index) in goods" :key="index">
					<!-- 通过body插槽定义商品布局 -->
					<view slot="body" class="shop" @click="showDetail(item)">
						<view style="display: flex;flex-direction:row;">
							<view class="shop-title">
								<text>{{item.name}}</text>
							</view>
							<view class="shop-price">								
								<text>{{item.reward}}</text>
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
				navList: ["消息", "通知"], //导航列表
				swiperBj: require('../../static/swiper-rf.png'),
				config: {
					//顶部导航栏参数
					title: '消息通知',
					color: '#ffffff',
					fontSize: '16px',
					isShow:false,
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
			this.loadModal = true
			this.getGoods("消息")
			
			uni.setNavigationBarColor({
			    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
			    backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
			    animation: {  //动画效果
			        duration: 100,
			        timingFunc: 'easeIn'
			    }
			})
		},
		onShow() { //tab页加载


		},
		methods: {
			navbarTapHandler(index) {
				this.currentIndex = index;
				this.getGoods(this.navList[index])	
			},
			showDetail(item) {
				var noticeInfo = JSON.stringify(item);
				 wx.navigateTo({
					url:"/pages/home/newDatil?noticeInfo="+noticeInfo
				 })
			},
			/* 消息列表 */
			getGoods(val) {
				var phone = wx.getStorageSync("phoneNumber")
				var url = "";
				if(val=="消息"){
					url = "/weixin/findXiaoxiListByTypeAndTel/2/"+phone;
				}else{
					url = "/weixin/findGongGaoNotice/0"
				}
				
				this.$http
					.testPost(url)
					.then(res => {
						this.loadModal = false
						if (res.data.code = 200) {
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
		color: black;
		margin-right: 10px;
	}
	
	.shop-price {
		// margin-top: 5px;
		font-size: 32upx;
		color: black;
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
