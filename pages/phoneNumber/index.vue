<template>
	<view class="phoneBox">
		<view class="login-top" v-if="!isArrge">
			<view class="desc">
				<image src="../../static/logoback.png" mode=""></image>
				<view class="title"></view>
			</view>
		</view>
		<button class="phone" :class="'bg-' + themeColor.name" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!isArrge">授权登录</button>
	</view>
</template>

<script>
	const baseUrl = require('@/common/vmeitime-http');
	import {mapState,
	mapMutations
	}
	from 'vuex';
	export default {
		data() {
			return {
				isArrge: false, //是否授权
				baseUrl:baseUrl.baseUrl,
				themeList: this.$mConstDataConfig.themeList,
			}
		},
		onLoad(){
			uni.setNavigationBarColor({
			    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
			    backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
			    animation: {  //动画效果
			        duration: 100,
			        timingFunc: 'easeIn'
			    }
			})
		},
		methods:{
			getPhoneNumber(e) {
				let that = this
				if (!e.target.iv) {
					uni.showModal({
						content: '获取手机号失败',
						showCancel: false
					});
				} else {
				  var openid = wx.getStorageSync("openid");
				    var sessionKey = wx.getStorageSync("sessionKey");
				    wx.request({
				      url: that.baseUrl+'/weixin/getUserPhoneNumber',
					  method:"POST",
					  async: false,
				      data: {
				        encryptedData: e.detail.encryptedData,
				        sessionkey: sessionKey,
				        iv: e.detail.iv,
				        openid: openid
				      },
				      success: function(res) {
				        if (res.data.phoneNumber != "") {
				          wx.showToast({
				            title: '绑定成功',
				            icon: 'success',
				            duration: 2000
				          });
						  
				          wx.setStorageSync("phoneNumber",res.data.phoneNumber);
						
						  
						  wx.reLaunch({
						    url:"/pages/home/home"
						  })
				        } else {
				          wx.showModal({
				            title: '提示',
				            content: '绑定失败',
				            showCancel: false
				          })
				        }
				      }
				    })
				
					this.isArrge = !this.isArrge;
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.phone {
		width: 70%;
		// height: 100upx;
		margin-top: 100upx;
		color: #ffffff;
		font-size: 30upx;
		border-radius: 50upx;
		// background-color: #642B8D;
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
</style>
