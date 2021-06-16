<template>
	<view class="commodity">
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color" v-if="loadModal" />
		<ss-scroll-navbar :tabCurrentIndex="currentIndex" @navbarTap="navbarTapHandler" :navArr='navList'>
		</ss-scroll-navbar>
		<uni-list :class="{ 'uni-list--waterfall': options.waterfall }">
			<!-- 通过 uni-list--waterfall 类决定页面布局方向 -->
			<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
			<uni-list-item :border="!options.waterfall" class="uni-list-item--waterfall" title="自定义商品列表"
				v-for="(item,index) in goods" :key="index">
				<!-- 通过header插槽定义列表左侧图片 -->
				<template v-slot:header>
					<view class="uni-thumb shop-picture" :class="{ 'shop-picture-column': options.waterfall }"
						@click="showSKU(item)">
						<image :src="baseUrl+item.imgUrl" mode="aspectFill"></image>
					</view>
				</template>
				<!-- 通过body插槽定义商品布局 -->
				<view slot="body" class="shop" @click="showSKU(item)">
					<!-- 	<view>
					</view> -->
					<view>
						<view class="uni-title">
							<text class="uni-ellipsis-2">{{ item.name }}</text>
						</view>
						<view class="shop-price">
							<text :class="'text-' + themeColor.name">¥</text>
							<text class="shop-price-text" :class="'text-' + themeColor.name">{{ item.price }}</text>
							<!-- <text>.00</text> -->
						</view>
						<view>
							<text class="remark">{{ item.remark }}</text>
							<!-- <text v-for="tag in item.tag" :key="tag" class="uni-tag">{{ tag }}</text> -->
						</view>
						<view class="uni-note">库存 {{ item.inventory }}</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<!-- sku弹出层 -->
		<view class="popup" catchtouchmove="true" :class="specClass" @touchmove.stop.prevent="moveHandle">
			<view class="mask" @tap="hideSKU"></view>
			<view class="layer attr-content">
				<view class="specification-wrapper">
					<scroll-view class="specification-wrapper-content" scroll-y="true">
						<view class="specification-header">
							<view class="specification-left">
								<image @tap="onPreviewImage" :data-src="baseUrl+seleteGood.imgUrl" class="product-img"
									:src="baseUrl+seleteGood.imgUrl"></image>
							</view>
							<view class="specification-right">
								<view class="price-content">
									<text class="sign" :class="'text-' + themeColor.name">¥</text>
									<text class="price" :class="'text-' + themeColor.name">{{ seleteGood.price || 0 }}</text>
								</view>
								<view class="inventory">库存:{{ seleteGood.inventory || 0 }}</view>
								<view class="choose">
									已选:
									<!-- <block v-for="(item, index) in specifications"> -->
									<text>{{seleteGood.name}}</text>
									<!-- </block> -->
								</view>
							</view>
						</view>
						<view class="specification-content">
							<view class="specification-item specification-item_display">
								<view class="item-title">数量</view>
								<view class="item-wrapper">
									<stepper v-if="specClass=='show'" size="small" :min="goodMinNum"
										:max="seleteGood.inventory" @change="changeNum"></stepper>
								</view>
							</view>
							<view class="specification-item specification-item_display">
								<view class="item-title">总价</view>
								<text class="shop-price-text" :class="'text-' + themeColor.name">¥{{allPrice}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="close" @tap="hideSKU">
						<image class="close-item" src="../../static/close.png"></image>
					</view>
				</view>
				<view class="btn-wrapper"><button class="sure" @click="skuOK" :class="'bg-' + themeColor.name">确定</button></view>
			</view>
		</view>
		<noData v-if="goods.length == 0"></noData>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex';
	import stepper from '@/components/sku/stepper.vue';
	import ssScrollNavbar from '@/components/ss-scroll-navbar/ss-scroll-navbar.vue'
	const baseUrl = require('@/common/vmeitime-http');
	import sku from '@/components/sku/sku.vue';
	export default {
		components: {
			ssScrollNavbar,
			sku,
			stepper,
		},
		data() {
			return {
				baseUrl: baseUrl.baseUrl,
				themeList: this.$mConstDataConfig.themeList,
				currentIndex: 0,
				currentIndex1: 0,
				navList: [], //导航列表
				loadModal: false, //加载
				goods: [], //商品类表
				goodNum: 1, //默认数量
				goodMinNum: 1, //最小选中数量
				goodImgList: [], //sku商品图片集合
				seleteGood: {}, //已选择商品、默认商品
				specClass: 'none', //显示隐藏
				specifications: [], //sku规格列表
				norm: [], //多规格数据
				norm_info: [], //多规格参数
				type: 0, //0加入购物车 1立即购买
				allPrice:0
			}
		},
		onLoad(options) {
			this.loadModal = true
			this.getMenu()
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
			navbarTapHandler(index) {
				this.currentIndex = index;
				this.loadModal = true
				this.getGoods(this.navList[index].dictValue)
			},
			navbarTapHandler1(index) {
				this.currentIndex1 = index;
				var obj = this.navList[index];
				// console.log('url：' + obj.url);
			},
			/* 菜单 */
			getMenu() {
				this.$http
					.testPost('/weixin/getDictType/goods_type')
					.then(res => {
						this.loadModal = false
						if (res.data.code = 200) {
							this.navList = res.data
							console.log(this.navList);
							this.getGoods(res.data[0].dictValue)
						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			/* 商品列表 */
			getGoods(val) {
				this.$http
					.testPost('/weixin/findAllStorages', {
						type: val
					})
					.then(res => {
						this.loadModal = false
						if (res.data.code = 200) {
							this.goods = res.data
							// console.log(res.data)
						} else {
							// this.$api.msg(res.data.msg);
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			onPreviewImage(e) {
				var dataset = e.currentTarget.dataset;
				// 预览图片  goodImgList
				// uni.previewImage({
				// 	urls: dataset,
				// 	longPressActions: {
				// 		itemList: ['发送给朋友', '保存图片', '收藏'],
				// 		success: function(data) {
				// 			console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				// 		},
				// 		fail: function(err) {
				// 			console.log(err.errMsg);
				// 		}
				// 	}
				// });
			},
			//规格弹窗开关
			moveHandle() {}, //禁止父元素滑动
			showSKU(val) {
				this.seleteGood = val
				this.specClass = 'show';
				this.allPrice = this.seleteGood.price;
			},
			hideSKU() {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			},
			changeNum(val) {
				var that = this;
				// console.log(val, "选中数量");
				that.goodNum = parseInt(val);
				that.allPrice = parseInt(val)*parseInt(that.seleteGood.price)
			},
			/**确认商品进行回调
			 * @param {Object} event
			 */
			skuOK(event) {
				var that = this;
				var comId = that.seleteGood.comId; //商品id
				var comCount = that.goodNum; //数量
				var comPrice = that.seleteGood.price; //金额
				if (comCount != "") {
					var openid = uni.getStorageSync("openid");
					var i = Math.random() * (999999 - 100000) + 100000;
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000;
					var j = parseInt(i, 10) + timestamp;
					var paidOrderId = comId + "_" + j;
					var money = comPrice * comCount;
					var service_url = that.baseUrl + '/weixin/';
					wx.request({
						url: service_url + 'wxPay?openid=' + openid + "&paidOrderId=" + paidOrderId + "&money=" +
							money,
						data: {},
						method: 'GET',
						success: function(res1) {
							that.doWxPay(res1.data, comId, comCount, j);
						},
						fail: function(error) {
							console.log("支付失败")
							console.log(error)
						}
					});
				}
				that.hideSKU();
			},
			doWxPay: function(param, comId, comCount, j) {
				var that = this;
				//小程序发起微信支付
				wx.requestPayment({
					timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
					nonceStr: param.data.nonceStr,
					package: param.data.package,
					signType: 'MD5',
					paySign: param.data.paySign,
					success: function(res) {
						if (res.errMsg == "requestPayment:ok") { // 调用支付成功
							that.outStorage(comId, comCount, j);
							wx.showModal({
								title: '提示',
								content: '购买成功',
								showCancel: false
							})
						} else if (res.errMsg == 'requestPayment:cancel') { // 用户取消支付的操作

						}
					},
					fail: function(error) {
						// fail   
						console.log("支付失败")
						console.log(error)
					},
					complete: function() {
						// complete   
						console.log("pay complete")
					}
				});
			},
			//出库
			outStorage: function(comId, comCount, j) {
				var that = this;
				var tel = wx.getStorageSync("phoneNumber");
				wx.request({
					url: that.baseUrl + "/weixin/outStorage/" + comId + "/" + comCount + "/" + tel +
						"/" + j,
					method: 'POST',
					success: function(res) {
						// that.setData({
						// 	hiddenmodalput: true
						// });
						// that.onShow();
					}
				});
			},
			success: function(e) {},
			error: function(e) {},
			setDataTap: function(e) {},
			getDataTap: function(e) {},
			initDataTap: function(e) {}
		}
	}
</script>

<style lang="scss" scoped>
	.commodity {
		position: absolute;
		top: 0upx;
		left: 0upx;
		bottom: 0upx;
		right: 0upx;
		background-color: #fff;

		.header {
			padding: 20upx;

			.title {
				font-size: $uni-font-size-base;
			}
		}
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

	.tips {
		color: #67c23a;
		font-size: 14px;
		line-height: 40px;
		text-align: center;
		background-color: #f0f9eb;
		height: 0;
		opacity: 0;
		transform: translateY(-100%);
		transition: all 0.3s;
	}

	.tips-ani {
		transform: translateY(0);
		height: 40px;
		opacity: 1;
	}

	.shop {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.shop-picture {
		width: 110px;
		height: 110px;
	}

	.shop-picture-column {
		width: 100%;
		height: 170px;
		margin-bottom: 10px;
	}

	.shop-price {
		margin-top: 5px;
		font-size: 32upx;
		color: #ff5a5f;
	}

	.remark {
		font-size: 26upx;
	}

	.shop-price-text {
		font-size: 32upx;
	}

	.hot-tag {
		background: #ff5a5f;
		border: none;
		color: #fff;
	}

	.button-box {
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		background: #007AFF;
		color: #fff;
	}

	.uni-link {
		flex-shrink: 0;
	}

	.ellipsis {
		display: flex;
		overflow: hidden;
	}

	.uni-ellipsis-1 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uni-ellipsis-2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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
<style lang="less">
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		overflow: hidden;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.3);
		}

		.layer {
			display: flex;
			width: 100%;
			// height: 1014rpx;
			flex-direction: column;
			// min-height: 40vh;
			// max-height: 1014rpx;
			position: fixed;
			z-index: 99;
			bottom: 0;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.specification-wrapper {
				width: 100%;
				padding: 30rpx 25rpx;
				box-sizing: border-box;

				.specification-wrapper-content {
					width: 100%;
					max-height: 900rpx;
					min-height: 600rpx;

					&::-webkit-scrollbar {
						/*隐藏滚轮*/
						display: none;
					}

					.specification-header {
						width: 100%;
						display: flex;
						flex-direction: row;
						position: relative;
						margin-bottom: 40rpx;

						.specification-left {
							width: 180rpx;
							height: 180rpx;
							flex: 0 0 180rpx;

							.product-img {
								width: 180rpx;
								height: 180rpx;
								background-color: #999999;
							}
						}

						.specification-right {
							flex: 1;
							padding: 0 35rpx 0 28rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
							font-weight: 500;

							.price-content {
								color: #642B8D;
								margin-bottom: 20rpx;

								.sign {
									font-size: 28rpx;
								}

								.price {
									font-size: 48rpx;
								}
							}

							.inventory {
								font-size: 24rpx;
								color: #999999;
								margin-bottom: 14rpx;
							}

							.choose {
								font-size: 28rpx;
								color: #333333;
							}
						}
					}

					.specification-content {
						font-weight: 500;

						.specification-item_display {
							display: flex;
							align-items: center;
							justify-content: space-between;
						}

						.specification-item {
							margin-bottom: 40rpx;

							&:last-child {
								margin-bottom: 0;
							}

							.item-title {
								margin-bottom: 20rpx;
								font-size: 28rpx;
								color: #999999;
							}

							.item-wrapper {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;

								.item-content {
									display: inline-block;
									padding: 15rpx 35rpx;
									border-radius: 10rpx;
									background-color: #ffffff;
									color: #333333;
									font-size: 28rpx;
									margin-right: 20rpx;
									margin-bottom: 10rpx;
									border: 2rpx solid #f4f4f4;
									box-sizing: border-box;

									&.actived {
										border-color: #642B8D;
										color: #642B8D;
									}

									&.noactived {
										background-color: #f4f4f4;
										border-color: #f4f4f4;
									}
								}
							}
						}
					}
				}

				.close {
					position: absolute;
					top: 30rpx;
					right: 25rpx;
					width: 37rpx;
					height: 37rpx;
					text-align: center;
					line-height: 37rpx;

					.close-item {
						width: 37rpx;
						height: 37rpx;
					}
				}
			}

			.btn-wrapper {
				display: flex;
				width: 100%;
				height: 120rpx;
				flex: 0 0 120rpx;
				align-items: center;
				justify-content: space-between;
				padding: 0 26rpx;
				box-sizing: border-box;

				.layer-btn {
					width: 335rpx;
					height: 76rpx;
					border-radius: 38rpx;
					color: #fff;
					line-height: 76rpx;
					text-align: center;
					font-weight: 500;
					font-size: 28rpx;

					&.add-cart {
						background: #ffbe46;
					}

					&.buy {
						background: #642B8D;
					}
				}

				.sure {
					width: 698rpx;
					height: 76rpx;
					border-radius: 38rpx;
					color: #fff;
					line-height: 76rpx;
					text-align: center;
					font-weight: 500;
					font-size: 28rpx;
					// background: #642B8D;
				}
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}
</style>





<!-- 1、引用组件
import 组件名称 from "../../components/组件名.vue";
2、注册组件
export default{
components:{
组件名称
},
}
3、在试图模板中使用组件
<组件名称 组件属性="对应的值"></组件名称> -->



<!-- beforeCreate 实例已经开始初始化之后调用 【数据初始化未完成，页面没有开始渲染】
created 实例创建完成之后调用 【组件创建完成，不代表组件已挂载到页面】
beforeMount 在挂载开始之前被调用。
mounted 挂载到实例上去之后调用。 注意：此处并不能确定子组件被全部挂载，　　　　　　　　　　 如果需要子组件完全挂载之后在执行操作可以使用$nextTickVue官方文档
beforeUpdate 数据更新时调用，发生在虚拟 DOM 打补丁之前。 仅H5平台支持
updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。 仅H5平台支持
beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。
destroyed Vue实例销毁后调用。调用后，Vue实例指示的所有东西都会解绑定，所有的事件监听器会被移除，　　　　　　　　　　所有的子实例也会被销毁。 -->



<!-- onLoad 监听页面加载，其参数为上个页面传递的数据，参数类型为object（用于页面传参）
onShow 监听页面显示
onReady 监听页面初次渲染完成
onHide 监听页面隐藏
onUnload 监听页面卸载
onPullDownRefresh 监听用户下拉动作
onReachBottom 页面上拉触底事件的处理函数
onShareAppMessage 用户点击右上角分享 微信小程序
onPageScroll 监听页面滚动
onTabItemTap 当前是 tab 页时，点击 tab 时触发。 -->
