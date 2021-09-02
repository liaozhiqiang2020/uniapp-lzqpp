<template>
	<view class="sign">
		<form>
			<view class="cu-form-group">
				<view class="title">手机</view>
				<input placeholder="请输入手机号" v-model="formData.phone"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input  placeholder="请输入姓名" v-model="formData.name"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">年龄</view>
				<input placeholder="请输入年龄" v-model="formData.age" @onkeyup = "value=value.replace(/[^\d]/g,'')"></input>
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
      	<view class="title">招生老师手机号</view>
      	<input placeholder="没有可不填写" v-model="formData.xstel"></input>
      </view>
			<!-- <view class="cu-form-group">
			</view> -->
			<view class="padding-xl">
				<button class="cu-btn block margin-tb-sm lg" :class="'bg-' + themeColor.name" :loading="loading" @click="submit">提交</button>
			</view>
			
			<view class="telicon" @click="calling"><image src="/static/tel.png"></image></view>
		</form>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				index: -1,
				picker: ['男', '女'],
				formData: {
					name: "",
					age: "",
					phone: "",
					school: "",
					name: "",
					sex: "",
				},
				loading: false, //加载状态
				themeList: this.$mConstDataConfig.themeList,
				share:{
					title: '',
					imageUrl:'',
				}
				
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
			
			this.loadShareImg();
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
				this.formData.sex = this.picker[this.index]
				// console.log(e.detail.value)
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
				} 
        else if (!numReg.test(this.formData.age)) {
					this.$api.msg('年龄只能输入数字')
				} 
    //     else if (this.formData.school == '') {
				// 	this.$api.msg('请输入学校')
				// } 
        else if (this.formData.sex == '') {
					this.$api.msg('请选择性别')
				} 
        else {
					this.loading = true
					this.$http
						.testPost('/weixin/addSignUp', this.formData)
						.then(res => {
							this.loading = false
							if (res.data==1) {
								uni.showToast({
									title: '报名成功',
									icon: 'success',
									duration: 2000,
									success: function() { //接口调用结束的回调函数 
										setTimeout(function() {
											//要延时执行的代码
											uni.navigateBack()
										}, 2000) //延迟时间  
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
			loadShareImg(){
			   this.$http
			   	.testPost('/weixin/findGongGaoNotice/3')
			   	.then(res => {
			   			this.loadModal = false
			   			this.share.imageUrl = 'https://lzqpp.natapp4.cc'+res.data[0].imgUrl
						this.share.title = '零之启乒乓在线报名'
			   		})
			   		.catch(err => {
			   			this.loadModal = false;
			   		});
			}
		},
		onShareAppMessage(res) {  
		 return {
		 			title: this.share.title,
		 			imageUrl:this.share.imageUrl
		 }
		  
		},
		onShareTimeline(res) {
			 return {
			 			title: this.share.title,
			 			imageUrl:this.share.imageUrl
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
	
	.telicon{width:120rpx;height:120rpx;position:fixed;bottom:80rpx;right:20rpx;}
	.telicon image{width:120rpx;height:120rpx;}
</style>
