<template>
	<view class="sign">
		<form>
			<view class="cu-form-group">
				<view class="title">手机</view>
				<input placeholder="请输入手机号" v-model="formData.phone"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="请输入姓名" v-model="formData.name"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">年龄</view>
				<input placeholder="请输入年龄" v-model="formData.age" @onkeyup="value=value.replace(/[^\d]/g,'')"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">学校</view>
				<input placeholder="请输入学校" v-model="formData.school"></input>
			</view>
			<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;">
				<view class="title">性别</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker" :style="{'color': (index>-1 ? '':'#999999')}">
						{{index>-1?picker[index]:'请选择性别'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;">
				<view class="title">报名俱乐部</view>
				<picker @change="PickerChange3" :range-key="'name'" :value="index3" :range="picker3">
					<view class="picker" :style="{'color': (index3>-1 ? '':'#999999')}">
						{{index3>-1?picker3[index3].name:'请选择所要报名的俱乐部'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;" v-if="showTeacher">
				<view class="title">招生老师</view>
				<picker @change="PickerChange2" :range-key="'name'" :value="index2" :range="picker2">
					<view class="picker" :style="{'color': (index2>-1 ? '':'#999999')}">
						{{index2>-1?picker2[index2].name:'请选择招生老师'}}
					</view>
				</picker>
			</view>
			<view class="padding-xl">
				<button class="cu-btn block margin-tb-sm lg" :class="'bg-' + themeColor.name" :loading="loading"
					@click="submit">提交</button>
			</view>

			<view class="telicon" @click="calling">
				<image src="/static/tel.png"></image>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				index: -1,
				index2: -1,
				index3: -1,
				picker: ['男', '女'],
				picker2: [],
				picker3: [],
				formData: {
					name: "",
					age: "",
					phone: "",
					school: "",
					name: "",
					sex: "",
					xstel: "",
					placeId: ""
				},
				loading: false, //加载状态
				themeList: this.$mConstDataConfig.themeList,
				share: {
					title: '',
					imageUrl: '',
				},
				showTeacher:false

			}
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
				backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
				animation: { //动画效果
					duration: 100,
					timingFunc: 'easeIn'
				}
			})

			// this.queryXiaoShou();
			this.queryPlaceName();
			this.loadShareImg();
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
				this.formData.sex = this.picker[this.index]
			},
			PickerChange2(e) {
				this.index2 = e.detail.value
				this.formData.xstel = this.picker2[this.index2].tel;
			},
			PickerChange3(e) {
				this.index3 = e.detail.value
				this.formData.placeId = this.picker3[this.index3].id;
				this.queryXiaoShou();
				this.showTeacher = true;
			},
			calling() {
				uni.makePhoneCall({
					phoneNumber: '17805421508' //仅为示例
				});
			},
			/* 提交表单 */
			submit() {
				let phoneReg = /^[1][3,6,4,5,7,8][0-9]{9}$/;
				let numReg = /^\d+$/;
				if (!phoneReg.test(this.formData.phone)) {
					this.$api.msg('手机号不合法')
				} else if (this.formData.name == '') {
					this.$api.msg('请输入姓名')
				} else if (!numReg.test(this.formData.age)) {
					this.$api.msg('年龄只能输入数字')
				} else if (this.formData.sex == '') {
					this.$api.msg('请选择性别')
				} else if (this.formData.xstel == '') {
					this.$api.msg('请选择招生老师')
				}
				else {
					this.loading = true
					this.$http
						.testPost('/weixin/addSignUp', this.formData)
						.then(res => {
							this.loading = false
							if (res.data == 1) {
								uni.showToast({
									title: '报名成功',
									icon: 'success',
									duration: 2000,
									success: function() { //接口调用结束的回调函数 
										setTimeout(function() {
											//要延时执行的代码
											uni.navigateBack()
										}, 1000) //延迟时间  
									}
								})
							} else {
								// this.$api.msg(res.data.msg);
							}
						})
						.catch(err => {
							this.loading = false
						});
				}
			},
			/* 查询销售 */
			queryXiaoShou() {
				var placeId = this.formData.placeId;
				
				this.$http
					.testPost('/weixin/findAllZSteacher', {
						placeId: this.formData.placeId
					})
					.then(res => {
						this.loadModal = false
						this.picker2 = res.data;
					})
					.catch(err => {
						this.loadModal = false;
					});
				
			},
			/* 查询场地 */
			queryPlaceName() {
				this.$http
					.testPost('/weixin/queryPlaces', {
					})
					.then(res => {
						this.loadModal = false
						this.picker3 = res.data;
					})
					.catch(err => {
						this.loadModal = false;
					});
			},
			loadShareImg() {
				this.$http
					.testPost('/weixin/findGongGaoNotice/3')
					.then(res => {
						this.loadModal = false
						this.share.imageUrl = 'https://lzqpp.natapp4.cc' + res.data[0].imgUrl
						this.share.title = uni.getStorageSync("placeName")+'乒乓在线报名'
					})
					.catch(err => {
						this.loadModal = false;
					});
			}
		},
		onShareAppMessage(res) {
			return {
				title: this.share.title,
				imageUrl: this.share.imageUrl
			}

		},
		onShareTimeline(res) {
			return {
				title: this.share.title,
				imageUrl: this.share.imageUrl
			}
		}
	}
</script>

<style lang="scss" scoped>
	input {
		text-align: right;
	}

	button {
		// background: #642B8D !important;
		color: #ffffff;
	}

	.telicon {
		width: 120rpx;
		height: 120rpx;
		position: fixed;
		bottom: 80rpx;
		right: 20rpx;
	}

	.telicon image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
