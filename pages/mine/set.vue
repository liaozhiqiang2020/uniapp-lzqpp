<template>
	<view class="set">
		<view class="cu-list menu sm-border" v-if="styleUserIsOpen">
			<view class="cu-item">
				<view class="content flex align-center">
					<text
						class="cuIcon-colorlens"
						:class="'text-' + themeColor.name"
					></text>
					<!-- <view
						class="padding solid radius shadow-blur"
						:class="'bg-' + themeColor.name"
					></view> -->
					<view class="title"
						>主题色：<text :class="'text-' + themeColor.name">{{
							themeColor.title
						}}</text></view
					>
				</view>
				<view class="action">
					<button
						class="cu-btn round shadow"
						@click="showColorModal"
						:class="'bg-' + themeColor.name"
					>
						<text class="cuIcon-colorlens"></text> 选择主题
					</button>
				</view>
			</view>
		</view>
		<!-- modal -->
		<!-- 选择颜色模态框 -->
		<view class="cu-modal" :class="{ show: colorModal }">
			<view class="cu-dialog">
				<view class="cu-bar justify-end solid-bottom">
					<view class="content">选择颜色</view>
					<view class="action" @tap="colorModal = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="grid col-5 padding">
					<view
						class="padding-xs"
						v-for="(item, index) in themeList"
						:key="index"
						@tap="SetColor(item)"
						:data-color="item.name"
					>
						<view class="padding-tb radius" :class="'bg-' + item.name">
							{{ item.title }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				check:false,
				checkYao:false,
				styleUserIsOpen: this.$mSettingConfig.styleUserIsOpen,
				colorModal: false,
				themeList: this.$mConstDataConfig.themeList,
				// DayNightModeList: this.$mConstDataConfig.DayNightModeList,
				setList: this.$mConstDataConfig.setList,
			};
		},
		onLoad(){
			this.check = this.propelling
			this.checkYao = this.yaoyiyao
			uni.setNavigationBarColor({
			    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
			    backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
			    animation: {  //动画效果
			        duration: 100,
			        timingFunc: 'easeIn'
			    }
			})
		},
		computed: {
			...mapState([])
		},
		methods:{
			...mapMutations([]),
			navTo(url){
				// this.$api.msg(`跳转到${url}`);
				uni.navigateTo({
					url: `/pages/${url}`
				});
			},
			remove(url){
				this.$api.msg('缓存已清除');
			},
			showColorModal() {
				this.colorModal = true;
			},
			SetColor(item) {
				this.colorModal = false;
				this.themeColor = item;
				this.$mStore.commit('setThemeColor', item);
				// console.log(this.$mStore.commit)
				// this.$mStore.commit('setDayNightMode', item);
				uni.setNavigationBarColor({
				    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
				    backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
				    animation: {  //动画效果
				        duration: 100,
				        timingFunc: 'easeIn'
				    }
				})
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
				    		setTimeout(()=>{
				    			uni.navigateBack();
				    		}, 200)
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.propellingStore(e.detail.value)
			},
			switchYaoChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				// console.log(statusTip)
				this.yaoStore(e.detail.value)
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>

