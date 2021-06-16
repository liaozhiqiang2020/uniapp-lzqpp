<template>
	<view class="t-login">
		<view class="login-top">
			<view class="desc">
				<image src="../../static/login.png" mode=""></image>
				<view class="title">垃圾分类智能化考核</view>
			</view>
		</view>
		<form class="cl">
			<view class="t-a"><input v-model="phone" type="number" v-if="isPhone" maxlength="11"
					:placeholder="isPhone?'请输入手机号':'请输入账号'" />
					<input v-model="phone" v-else :placeholder="isPhone?'请输入手机号':'请输入账号'" /></view>
					
			<view class="t-a">

				<!-- #ifdef !MP-WEIXIN -->
				<input v-model="code" type="number" maxlength="4" :placeholder="isPhone?'请输入验证码':'请输入密码'" />
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<input v-model="code" v-if="isPhone" confirm-type="submit" @confirm="submit" type="number" maxlength="4"
					:placeholder="isPhone?'请输入验证码':'请输入密码'" />
				<input v-model="code" v-else confirm-type="submit" @confirm="submit"
					:placeholder="isPhone?'请输入验证码':'请输入密码'" />
				<!-- #endif -->

				<!-- <view class="t-c">发送短信</view> -->
				<view class="t-c" v-if="isPhone">
					<text v-if="!smsCodeBtnDisabled" @tap.stop="getSmsCode">获取验证码</text>
					<text v-else class="sms-code-resend">{{ `重新发送 (${codeSeconds})` }}</text>
				</view>
			</view>
			<!-- <view class="footer-protocol" :class="disabled ? `doudun` : ''">
				<text @tap="appAgreementDefaultSelect = !appAgreementDefaultSelect" class="cuIcon" :class="appAgreementDefaultSelect ? `cuIcon-radiobox` : 'cuIcon-round'"></text>
				<text class="content" @tap="appAgreementDefaultSelect = !appAgreementDefaultSelect">点击同意</text>
				<text @tap="handleRfProtocolPopupShow" style="color:#00B865">《服务协议》</text>
			</view> -->
			<!-- <button class="make_start_btn" open-type="getUserProfile">点击登录</button> -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <button :loading="loading" form-type="submit" open-type="getUserInfo" withCredentials="true" @getuserinfo="getUserInfo" v-if="img_uploadState.shenhe == 'Y'">
				登录
			</button> -->
			<button :loading="loading" form-type="submit" @click="getUserInfo"
				v-if="img_uploadState.shenhe == 'Y'">登录</button>
			<button :loading="loading" form-type="submit" @click="getUserInfo"
				v-if="img_uploadState.shenhe == 'N'">登录</button>
			<!-- #endif -->

			<!-- #ifdef !MP-WEIXIN -->
			<button :loading="loading" @tap="getUserInfo">登录</button>
			<!-- #endif -->

			<view class="type" @click="isPhone = !isPhone">{{isPhone?'账号密码登录':'手机号码登录'}}</view>
		</form>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const baseUrl = require('@/common/vmeitime-http');
	import rfProtocolPopup from '@/components/rf-protocol-popup/index.vue';
	export default {
		components: {
			rfProtocolPopup
		},
		computed: {
			...mapState(['img_uploadState'])
		},
		data() {
			return {
				appAgreementDefaultSelect: false, // 是否允许点击登录按钮
				isRfProtocolPopupShow: false, // 控制协议popup显示
				loading: false, //加载状态
				smsCodeBtnDisabled: false,
				// appName: this.$mSettingConfig.appName,
				disabled: false,
				phone: '',
				code: '',
				codeSeconds: 0, // 验证码发送时间间隔
				wxCode: '',
				avatarUrl: '',
				isPhone: true,
			};
		},
		onBackPress(options) {
			//  // return true 表示禁止默认返回
			// return true;
			// console.log(options);
			if (options.from == 'backbutton') {
				return true;
			}
		},
		onLoad() {
			// wx.login({
			// 	success(res) {

			// 		console.log(res.code)
			// 	},
			// 	fail(err) {
			// 		console.log(err);
			// 	}
			// });
			// // #ifdef APP-PLUS
			// var page = this.$mp.page.$getAppWebview();
			// page.setStyle({
			// 	popGesture: 'none'
			// });
			// // #endif
			this.img_upload();
			this.$mStore.commit('logout');

			// #ifdef MP-WEIXIN
			this.Wxcode();
			// #endif
		},
		methods: {
			getUserProfile() {},
			Wxcode() {
				let that = this;
				wx.login({
					success(res) {
						that.wxCode = res.code;
						// console.log(res.code)
					},
					fail(err) {
						console.log(err);
					}
				});
			},
			handleRfProtocolPopupShow() {},
			img_upload() {
				//是否开启选择相册
				uni.request({
					method: 'GET',
					url: baseUrl.baseUrl + '/app/configKey/img_upload', //仅为示例，并非真实接口地址。
					success: res => {
						if (res.data.code == 200) {
							this.$mStore.commit('img_upload', res.data.data);
						} else {
							this.$api.msg(res.data.msg);
						}
					}
				});
			},
			getSmsCode() {
				//获取验证码
				let phoneReg = /^[1][3,6,4,5,7,8][0-9]{9}$/;
				if (!phoneReg.test(this.phone)) {
					uni.showToast({
						title: '手机号不合法',
						duration: 2000,
						icon: 'none'
					});
				} else {
					this.$http
						.testPost('/mobile/sendCode', {
							phonenumber: this.phone
						})
						.then(res => {
							// console.log(res.data.code);
							if (res.data.code == 200) {
								this.$api.msg('已发送 ！');
								this.handleSmsCodeTime(59);
							}
						})
						.catch(err => {
							this.$api.msg('请检查网络 ！');
						});
				}
			},
			getUserInfo() {
				var that = this;
				let phoneReg = /^[1][3,4,6,5,7,8][0-9]{9}$/;
				let numReg = /^\d+$/;
				if (this.isPhone) {
					if (!phoneReg.test(that.phone)) {
						uni.showToast({
							title: '手机号不合法',
							duration: 2000,
							icon: 'none'
						});
					} else if (!numReg.test(that.code)) {
						uni.showToast({
							title: '验证码不合法',
							duration: 2000,
							icon: 'none'
						});
					} else {
						// #ifdef MP-WEIXIN
						// if (this.img_uploadState.shenhe == 'Y') {
						// 	// uni.getUserProfile({
						// 	//     desc:'获取用户相关信息',
						// 	//     success:res=>{
						// 	// 		that.avatarUrl =res.userInfo.avatarUrl
						// 	// 		// console.log(that.avatarUrl)
						// 	//             // console.log("getUserProfile",res);
						// 	// 			uni.request({
						// 	// 				method: 'POST',
						// 	// 				url: baseUrl.baseUrl + '/mobileLogin', //仅为示例，并非真实接口地址。
						// 	// 				data: { username: that.phone, code: that.code },
						// 	// 				success: res => {
						// 	// 					that.loading = false;
						// 	// 					if (res.data.code == 200) {
						// 	// 						that.userInfo(res.data.token);
						// 	// 					} else {
						// 	// 						that.$api.msg(res.data.msg);
						// 	// 					}
						// 	// 				}
						// 	// 			});
						// 	//     },
						// 	// 		fail(err) {
						// 	// 			console.log(err);
						// 	// 		}
						// 	// });
						// 	//查看是否授权
						// 	// wx.getSetting({
						// 	// 	success: function(res) {
						// 	// 		if (res.authSetting['scope.userInfo']) {
						// 	// 			wx.login({
						// 	// 				success(res) {
						// 	// 					if (res.code) {
						// 	// 						that.wxCode = res.code;
						// 	// 						that.loading = true;
						// 	// 						uni.request({
						// 	// 							method: 'POST',
						// 	// 							url: baseUrl.baseUrl + '/mobileLogin', //仅为示例，并非真实接口地址。
						// 	// 							data: { username: that.phone, code: that.code },
						// 	// 							success: res => {
						// 	// 								that.loading = false;
						// 	// 								if (res.data.code == 200) {
						// 	// 									that.userInfo(res.data.token);
						// 	// 								} else {
						// 	// 									that.$api.msg(res.data.msg);
						// 	// 								}
						// 	// 							}
						// 	// 						});
						// 	// 					} else {
						// 	// 					}
						// 	// 				},
						// 	// 				fail(err) {
						// 	// 					console.log(err);
						// 	// 				}
						// 	// 			});
						// 	// 		} else {
						// 	// 			//用户没有授权
						// 	// 			console.log('用户没有授权');
						// 	// 			// that.showSettingToast('请授权');
						// 	// 		}
						// 	// 	}
						// 	// });
						// } else {
						// 	that.loading = true;
						// 	uni.request({
						// 		method: 'POST',
						// 		url: baseUrl.baseUrl + '/mobileLogin', //仅为示例，并非真实接口地址。
						// 		data: { username: that.phone, code: that.code },
						// 		success: res => {
						// 			that.loading = false;
						// 			if (res.data.code == 200) {
						// 				that.userInfo(res.data.token);
						// 			} else {
						// 				that.$api.msg(res.data.msg);
						// 			}
						// 		}
						// 	});
						// }
						that.loading = true;
						uni.request({
							method: 'POST',
							url: baseUrl.baseUrl + '/mobileLogin', //仅为示例，并非真实接口地址。
							data: {
								username: that.phone,
								code: that.code
							},
							success: res => {
								that.loading = false;
								if (res.data.code == 200) {
									that.userInfo(res.data.token);
								} else {
									that.$api.msg(res.data.msg);
								}
							}
						});
						// #endif

						// #ifdef !MP-WEIXIN
						//查看是否授权
						that.loading = true;
						uni.request({
							method: 'POST',
							url: baseUrl.baseUrl + '/mobileLogin', //仅为示例，并非真实接口地址。
							data: {
								username: that.phone,
								code: that.code
							},
							success: res => {
								that.loading = false;
								if (res.data.code == 200) {
									that.userInfo(res.data.token);
								} else {
									that.$api.msg(res.data.msg);
								}
							}
						});
						// #endif
					}
				} else {
					if (that.phone == '') {
						uni.showToast({
							title: '请输入账号',
							duration: 2000,
							icon: 'none'
						});
					} else if (that.code == '') {
						uni.showToast({
							title: '请输入账号密码',
							duration: 2000,
							icon: 'none'
						});
					} else {
						that.loading = true;
						uni.request({
							method: 'POST',
							url: baseUrl.baseUrl + '/mobileAccountLogin', //仅为示例，并非真实接口地址。
							data: {
								username: that.phone,
								password: that.code
							},
							success: res => {
								that.loading = false;
								if (res.data.code == 200) {
									that.userInfo(res.data.token);
								} else {
									that.$api.msg(res.data.msg);
								}
							}
						});
					}
				}
			},
			userInfo(val) {
				let that = this;
				uni.request({
					method: 'POST',
					url: baseUrl.baseUrl + '/updateUseropenId', //仅为示例，并非真实接口地址。
					data: {
						touser: that.wxCode
					},
					header: {
						Authorization: val
					},
					success: res => {}
				});
				uni.request({
					url: baseUrl.baseUrl + '/getInfo', //仅为示例，并非真实接口地址。
					header: {
						Authorization: val
					},
					success: res => {
						if (res.data.code == 200) {
							var obj = {};
							obj = res.data;
							obj.token = val;
							obj.avatarUrl = that.avatarUrl;
							// console.log(obj)
							this.$mStore.commit('login', obj);
							if (obj.roles[0] == 'wentizhenggai') {
								uni.reLaunch({
									url: '/pages/home/question/index'
								});
							} else {
								uni.switchTab({
									url: '/pages/home/home'
								});
							}
						} else if (res.data.code == 500) {
							this.$api.msg('账号不存在');
						} else {
							this.$api.msg(res.data.msg);
						}
					}
				});
			},
			handleSmsCodeTime(time) {
				let timer = setInterval(() => {
					if (time === 0) {
						clearInterval(timer);
						this.smsCodeBtnDisabled = false;
					} else {
						this.codeSeconds = time;
						this.smsCodeBtnDisabled = true;
						time--;
					}
				}, 1000);
			},
			// 打开权限设置页提示框
			showSettingToast: function(e) {
				wx.showModal({
					title: '提示',
					confirmText: '去设置',
					showCancel: false,
					content: e,
					success: function(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: '/pages/login/set'
							});
						}
					}
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.t-login {
		margin: 0 auto;
		font-size: 28rpx;
		color: #000;
		width: 100vw;
		height: 100vh;
		// background-color:orange;
		background-size: 100% 100%;
	}

	.login-top {
		height: 460upx;
		position: relative;

		.desc {
			position: absolute;
			color: #000000;
			top: 160upx;
			font-size: 32upx;

			.title {
				font-size: 32upx;
				font-family: Microsoft YaHei;
				font-weight: bold;
				color: #333333;
				width: 100vw;
				text-align: center;
			}

			image {
				width: 196upx;
				height: 196upx;
				position: relative;
				left: 50%;
				margin-left: -88upx;
			}
		}
	}

	.t-login button {
		font-size: 32rpx;
		color: #fff;
		position: relative;
		left: 50%;
		margin-left: -285upx;
		line-height: 100rpx;
		border-radius: 14upx;
		margin-top: 130upx;
		width: 570upx;
		height: 100upx;
		background-color: #00b865;
		border-radius: 10upx;
	}

	.t-login .disBtn {
		background-color: #7fd4ae;
	}

	.t-login input {
		padding: 0 20rpx 0 16rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 25rpx;
		border-bottom: 1upx solid #dedede;
		// background: rgba(255, 255, 255, 0.5);
		font-size: 30upx;
		// border-radius: 14upx;
	}

	.t-login .t-a {
		position: relative;
		width: 650upx;
		left: 50%;
		margin-left: -325upx;
	}

	.t-login .t-a image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 28rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx;
	}

	.t-login .t-b {
		text-align: center;
		font-size: 46rpx;
		color: #000;
		padding: 100rpx 0;
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: none;
		color: #888888;
		font-size: 30upx;
		border-radius: 50rpx;
		height: 50rpx;
		width: 240upx;
		right: 50upx;
		text-align: center;
		line-height: 50rpx;
		padding: 0 25rpx;
		left: 65%;
		border: none !important;
		z-index: 100;

		text {
			color: #6e6c6c;
		}
	}

	uni-button:after {
		border: none !important;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 70upx;
		height: 70upx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 80rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 8rpx;
		color: #999;
	}

	.t-login .uni-input-placeholder {
		color: #888888;
	}

	.cl {
		position: relative;
		top: 50upx;
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}

	.footer-protocol {
		display: flex;
		width: 600upx;
		flex-direction: row;
		position: relative;
		margin-left: -300upx;
		left: 50%;
		top: 0%;
		justify-content: flex-start;

		text {
			font-size: 22upx;
			color: #888888;
		}
	}

	.cuIcon {
		padding: 0upx;
	}

	@-moz-keyframes tada {
		0% {
			-moz-transform: translate(0);
		}

		10%,
		20% {
			-moz-transform: translate(30px);
		}

		30%,
		50%,
		70%,
		90% {
			-moz-transform: translate(0px);
		}

		40%,
		60%,
		80% {
			-moz-transform: translate(30px);
		}

		100% {
			-moz-transform: translate(0);
		}
	}

	@-webkit-keyframes tada {
		0% {
			-webkit-transform: translate(0);
		}

		10%,
		20% {
			-webkit-transform: translate(30px);
		}

		30%,
		50%,
		70%,
		90% {
			-webkit-transform: translate(0px);
		}

		40%,
		60%,
		80% {
			-webkit-transform: translate(30px);
		}

		100% {
			-webkit-transform: translate(0);
		}
	}

	.doudun {
		position: relative;
		-webkit-animation: tada 1s 0.2s ease both;
		-moz-animation: tada 1s 0.2s ease both;
	}

	.type {
		width: 100%;
		color: #999999;
		text-align: center;
		margin-top: 50upx;
	}
</style>
