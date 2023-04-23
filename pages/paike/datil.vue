<template>
	<view class="signBox">
		<view class="cu-list menu border" :class="[menuBorder ? 'sm-border' : '']">
			<view class="cu-item" :class="menuArrow ? '' : ''">
				<view class="content">
					<text class="text-color">切换学员</text>
				</view>
				<view class="action">
					<picker @change="PickerChange" :range-key="'name'" :value="index" :range="picker">
						<view class="picker" :style="{'color': (index>-1 ? '':'#999999')}">
							{{index>-1?picker[index].name:'请选择学员'}}
						</view>
					</picker>
				</view>
				<view>
					<text class="text-grey text-sm cuIcon-unfold"></text>
				</view>
			</view>
		</view>
		<!-- <view class="test" v-if="JSON.stringify(formData) != '{}'" @click="sign">
			<view class="dot">
				<text>{{stuName}}</text>
				<text class="text-white" style="font-size: 30upx;">签到打卡</text>
			</view>
		</view> -->
		<!-- <noData v-if="list.length == 0"></noData> -->
		<ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color"
			v-if="loadModal" />
	</view>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {

		},
		data() {

			return {
				menuBorder: true,
				menuArrow: true,
				menuCard: true,
				index: -1,
				picker: [],
				loadModal: false,
				formData: {},
				id: "",
				chargeType: "",
				stuName: ""
			}
		},
		onLoad(val) {
			this.addr();
			uni.setNavigationBarColor({
				frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
				backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
				animation: { //动画效果
					duration: 100,
					timingFunc: 'easeIn'
				}
			})
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value;
				this.formData = this.picker[this.index];

				uni.navigateTo({
					url: "/pages/paike/index?studentId=" + this.formData.id + "&chargeType=" +
						this.formData.chargeType + "&placeId=" +
						this.formData.placeId
				});
			},
			/* 查询学员 */
			addr() {
				// var placeId = wx.getStorageSync("placeId")
				
				this.$http
					.testPost('/weixin/queryStudentByPlace/' + 1)
					.then(res => {
						this.loadModal = false
						this.picker = res.data
					})
					.catch(err => {
						this.loadModal = false;
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.signBox {
		.cu-list {
			width: 100%;

			// border-radius: 2upx;
			// box-shadow: 0px 14upx 16upx 0px rgba(43, 102, 253, 0.07);
			.cu-item {
				border-bottom: 1rpx solid #fff;
			}

			.text-color {
				font-size: 30upx;
				color: #4d4d4d;
			}

			.iconSize {
				font-size: 40upx;
				position: relative;
				top: 7upx;
			}
		}
	}

	.cu-list+.cu-list {
		margin-top: 0;
	}

	.action {
		width: 72%;
		height: 100%;
	}

	.border {
		border-bottom: 5rpx solid rgba(242, 242, 242, 1);
	}

	.test {
		$colors: #379d51, #89cff0, #4682b4, #0f52ba, #000080;
		display: flex;
		animation-delay: 1s;
		position: relative;
		margin: 180upx 0;

		.dot {
			position: relative;
			left: 50%;
			margin-left: -125upx;
			width: 250upx;
			height: 250upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// margin: 0.8em;
			top: 45upx;
			border-radius: 50%;

			&::before {
				position: absolute;
				content: '';
				width: 100%;
				height: 100%;
				background: inherit;
				border-radius: inherit;
				animation: wave 2s ease-out infinite;
			}

			@for $i from 1 through 5 {
				&:nth-child(#{$i}) {
					background: nth($colors, $i);

					&::before {
						animation-delay: $i * 0.2s;
					}
				}
			}
		}
	}

	@keyframes wave {

		50%,
		75% {
			transform: scale(1.25);
		}

		80%,
		100% {
			opacity: 0;
		}
	}
</style>
