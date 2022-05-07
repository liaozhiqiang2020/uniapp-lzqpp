<template>
		
		<view class="homeBox">
			<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
			
			<view class="cover">
				 <ly-tree :tree-data="achievement" 
								ref="tree"
								node-key="id" 
								accordion
								showCheckbox="false"
								showRadio="false"
								:checkStrictly= "false"
								defaultExpandAll="true"
								:props="permissionProps"
								:defaultCheckedKeys="selectedID">
				 </ly-tree>
			 </view>
			 
			
			<noData v-if="goods.length == 0"></noData>
			
		</view>
		

</template>

<script>
	const baseUrl = require('@/common/vmeitime-http');
	import ssScrollNavbar from '@/components/ss-scroll-navbar/ss-scroll-navbar2';
	import hxNavbar from '@/components/hx-navbar/hx-navbar';
	import LyTree from "@/components/ly-tree/ly-tree.vue";
	import tkiTree from "@/components/tki-tree/tki-tree.vue";
	import {
		mapState,
		mapMutations
	}
	from 'vuex';

	export default {
		components: {
			ssScrollNavbar,
			hxNavbar,
			LyTree,
			tkiTree
		},
		data() {
			return {
				loadModal: false, //加载
				baseUrl: baseUrl.baseUrl,
				themeList: this.$mConstDataConfig.themeList,
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
				achievement: [], //成就列表,
				selectedID:"",
				permissionProps: {
					children: "children",
					label: "name"
				},
				
			}
		},
		onLoad(val) {
			this.studentName = val.name;
			this.studentId = val.studentId;
			console.log(this.studentName);
			console.log(this.studentId);
			this.loadModal = true
			this.showDetail(this.studentId);
			
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
			this.showTree();

		},
		methods: {
			navbarTapHandler(index) {
				this.currentIndex = index;
				this.getGoods(this.navList[index])	
			},
			showDetail(studentId) {
				this.$http
					.testPost("/weixin/selectAchievementlist/"+studentId)
					.then(res => {
						this.loadModal = false
						if (res.data.code = 200) {
							this.achievement = res.data.menus;
							// console.log(this.achievement);
							
							let checkedKeys = JSON.parse(res.data.checkedKeys);
							this.selectedID = checkedKeys;
							// console.log(checkedKeys);
							// checkedKeys.forEach((v) => {
							//   this.$nextTick(()=>{
							// 	this.$refs.tree.setChecked(v, true ,false);
							//   })
							// })
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
	
	// .cover {
	//            height: 100%;
	//            position: fixed;
	//            top: 0;
	//            left: 0;
	//            display: flex;
	//            justify-content: center;
	//            align-items: center;
	//            z-index: 0;
	// 		   background: rgba(0,0,0,0)
	//          }
	
	
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
