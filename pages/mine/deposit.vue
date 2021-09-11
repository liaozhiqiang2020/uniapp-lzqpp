<template>
	<view class="mine">
		<view class="minecontent">
			<view class="middle">
				<view class="middleboxtop" :class="'bg-' + themeColor.name">
					<nav>账户总余额（元）:</nav>
					<aside>
						<p>￥</p>
						<h6>{{account}}</h6>
					</aside>
				</view>
			</view>
		</view>
		<!-- 选择充值金额 -->
		<view class='title'>选择充值金额</view>
		<view class="moneyBox">
			<view v-for="(item,index) in moneylist" :key="index" class="number" :style="{'border':money==item.money? '2rpx solid '+themeColor.color:''}"
				@click='changeNum(item,index)'>
				<text class="money">{{item.money}}元</text>
				<text class="ddb">{{item.ddb}}</text>
			</view>
		</view>
		<!-- 自定义金额 -->
	<!-- 	<view class="inputBox">
			<input type="number" step="0.01" placeholder="自定义金额" v-model="money"></input>
			<button class="button" v-if="money != ''" @click="submit">确认</button>
			<button class="button ccc" v-else>确认</button>
		</view> -->
		<view style="width: 100vw;height: 30upx;"></view>
		<fx-amountInput currency="￥" fontSize="24" confirmText="充值" :btnColor="themeColor.color" placeholder="请输入充值金额" maxNumber="100000000000" isBold="false" isFilter="true" @change="change" @confirm="confirm"></fx-amountInput>
	</view>
</template>

<script>
	const baseUrl = require('@/common/vmeitime-http');
	import fxAmountInput from '@/components/fx-amountInput/fx-amountInput.vue';
	const util = require('@/utils/throttle.js')
	import { mapState ,mapMutations} from 'vuex';
	export default {
		components:{
			fxAmountInput
		},
		data() {
			return {
				themeList: this.$mConstDataConfig.themeList,
				loadModal: false, //加载中
				account: 0.00, //账户余额
				moneylist: [],
    //     [{
				// 		id: 1,
				// 		money: 1000,
				// 		ddb: "充1000送100"
				// 	},
				// 	{
				// 		id: 2,
				// 		money: 3000,
				// 		ddb: "充3000送500"
				// 	},
				// 	{
				// 		id: 3,
				// 		money: 5000,
				// 		ddb: "充5000送1399"
				// 	},
				// 	{
				// 		id: 4,
				// 		money: 7000,
				// 		ddb: "充7000送2000"
				// 	},
				// 	{
				// 		id: 5,
				// 		money: 10000,
				// 		ddb: "充10000送3899"
				// 	},
    //       // {
    //       //   id:6,
    //       //   money:99,
    //       //   ddb:"99元四节体验课"
    //       // }
				// ],
				money: "", //充值金额
				baseUrl: baseUrl.baseUrl, //接口链接
			};
		},
		onLoad() {
			this.loadModal = true
      this.queryMoneyList();
			this.queryBalanceByPhone();
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
      queryMoneyList(){
        this.$http
        	.testPost('/weixin/queryAllPrice')
        	.then(res => {
        		this.loadModal = false
            console.log(res.data);
            for (var i = 0; i < res.data.length; i++) {
              this.moneylist.push({
                id:res.data[i].id,
                money:res.data[i].realPrice,
                ddb:res.data[i].remarks,
              });
            }
            console.log(this.moneylist);
        		// this.moneylist = res.data
        	})
        	.catch(err => {
        		// uni.stopPullDownRefresh();
        		this.loadModal = false;
        	});
          
      },
			changeNum(item, index) {
				// console.log(this.money)
				this.money = item.money
				this.submit()
			},
			change(e){
				this.money =e
				uni.vibrateShort({
				    success: function () {
				        console.log('success');
				    }
				});
			},
			confirm(){
				this.submit()
				
			},
			/* 查询余额 */
			queryBalanceByPhone() {
				var phone = wx.getStorageSync("phoneNumber")
				this.$http
					.testPost('/weixin/queryBalanceByPhone/'+ phone)
					.then(res => {
						this.loadModal = false
						this.account = res.data
					})
					.catch(err => {
						// uni.stopPullDownRefresh();
						this.loadModal = false;
					});
			},
			/* 充值 */
			submit() {
				let numReg = /^\d+$/;
				// if (!numReg.test(this.money)) {
				if (1 == 2) {
					this.$api.msg('请输入整数金额')
				} else {
					// util.throttle(function(e) {
					var that = this;
					that.loadModal = true
					var mobilePhone = wx.getStorageSync("phoneNumber");
					if (mobilePhone != undefined) {
						var openid = wx.getStorageSync("openid");
						var i = Math.random() * (999999 - 100000) + 100000;
						var timestamp = Date.parse(new Date());
						timestamp = timestamp / 1000;
						var j = parseInt(i, 10) + timestamp;
						var paidOrderId = mobilePhone + "_" + j;
						var money = that.money;
						var service_url = that.baseUrl + '/weixin/';
						wx.request({
							url: service_url + 'wxPay?openid=' + openid + "&paidOrderId=" +
								paidOrderId + "&money=" + money,
							data: {},
							method: 'GET',
							success: function(res1) {
								that.loadModal = false
								that.doWxPay(res1.data, mobilePhone, money);
							},
							fail: function(res) {
								that.loadModal = false
								console.log("支付失败")
								console.log(error)
							}
						});
					}
					// }, 5000),
				}
			},
			doWxPay(param, mobilePhone, money, j) {
				console.log(mobilePhone);
				var that = this;
				//小程序发起微信支付
				wx.requestPayment({
					timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
					nonceStr: param.data.nonceStr,
					package: param.data.package,
					signType: 'MD5',
					paySign: param.data.paySign,
					success: function(res) {
						// success   
						console.log(res);

						if (res.errMsg == "requestPayment:ok") { // 调用支付成功
							that.addTuition(mobilePhone, money, j);
							wx.showModal({
							  title: '感谢使用',
							  content: '成功',
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
			addTuition(mobilePhone, money, j) {
				var that = this;
				wx.request({
					header: {
						'content-Type': 'application/json'
					},
					dataType: 'json',
					method: 'POST',
					url: that.baseUrl + '/weixin/addTuitionByPhone/' + mobilePhone + "/" + money + "/" + j,
					success: function(res) {
						if (res.data == 0) {

						} else if (res.data == 1) {
							wx.showToast({
								title: '支付成功',
								icon: 'success',
								duration: 2000
							});
							that.queryBalanceByPhone()
							setTimeout(function() {
								//要延时执行的代码
								uni.navigateBack()
							}, 2000) //延迟时间  
						}
					}
				})
			},
		},
	}
</script>
<style lang="scss" scoped>
	.mine {
		.middle {
			width: 100%;
			flex: 1;
			overflow: auto;

			// margin-top: 0.63rem;
			.middleboxtop {
				display: flex;
				height: 160upx;
				width: 100%;
				padding: 0 30upx 0 30upx;
				justify-content: space-between;
				align-items: center;
				position: relative;
				// background: #642B8D;
				position: relative;

				nav {
					font-size: 26upx;
					-webkit-font-family: Microsoft YaHei;
					font-weight: 400;
					color: rgba(255, 255, 255, 1);
					position: absolute;
					top: 10upx;
				}

				aside {
					position: relative;
					top: 20upx;
					display: flex;
					align-items: center;

					p {
						font-size: 30upx;
						-webkit-font-family: Microsoft YaHei;
						font-weight: 400;
						margin-left: 20upx;
						color: white;
					}

					h6 {
						font-size: 50upx;
						-webkit-font-family: Microsoft YaHei;
						font-weight: 500;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}

		.title {
			font-size: 30rpx;
			font-family: Microsoft YaHei;
			font-weight: bold;
			line-height: 31rpx;
			padding: 36rpx 0 20rpx 30rpx;
		}

		.moneyBox {
			height: 260rpx;
			padding: 0 15rpx 0 18.2rpx;
			position: relative;
			z-index: 100000;
			/* display: flex; */
			.number {
				width: 216rpx;
				height: 120rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 10rpx;
				float: left;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 20rpx 0 0 15rpx;
				border: 2rpx solid rgba(242, 242, 242, 1);
			}

			.ddb,
			.money {
				font-size: 24rpx;
				font-family: Microsoft YaHei;
				color: rgba(85, 85, 85, 1);
				color: rgba(187, 187, 187, 1);
			}

			.money {
				font-size: 28rpx;
				font-weight: bold;
				color: rgba(85, 85, 85, 1);
			}

			.active {
				border: 2rpx solid #642B8D;
			}
		}

		.inputBox {
			width: 690rpx;
			height: 100rpx;
			background: rgba(242, 242, 242, 1);
			border-radius: 10rpx;
			position: absolute;
			left: 0;
			right: 0;
			margin: 50rpx auto;

			input {
				width: 80%;
				height: 100rpx;
				background: rgba(242, 242, 242, 1);
				border-radius: 10rpx;
				font-size: 28rpx;
				font-family: Microsoft YaHei;
				font-weight: 400;
				padding-left: 33rpx;
			}

			.button {
				width: 120upx;
				height: 50rpx;
				background: #642B8D;
				border-radius: 30rpx;
				padding: 0;
				font-size: 28rpx;
				font-family: Microsoft YaHei;
				font-weight: 400;
				line-height: 50rpx;
				position: absolute;
				top: 0;
				bottom: 0;
				margin: auto 0;
				right: 30rpx;
				color: rgba(255, 255, 255, 1);
			}

			.ccc {
				background: white;
				color: rgba(0, 0, 0, 0.4);
			}
		}

		input::input-placeholder {
			color: rgba(187, 187, 187, 1)
		}
	}
</style>
