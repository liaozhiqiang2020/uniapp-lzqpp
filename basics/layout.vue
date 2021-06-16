<template>
	<view>
		<block v-if="TabCur == 'home'">
			<view class="bg-white padding" style="padding:5px 15px">
				<view class="grid margin-bottom text-center" :class="'col-' + 2">
					<view class="padding item" @click="navToKh(item)" :class="item.checked != '0' ? 'gary' : ''" v-for="(item, indexs) in homeLayout" :key="indexs">
						<view class="left">
							<view class="text-black text-bold">{{ item.menuName }}</view>
							<view class="text-gray small-text">{{ item.remark }}</view>
						</view>
						<view class="right"><image v-if="item.checked == '0'" :src="item.imgActive" mode="">
						<image v-else :src="item.img" mode=""></image></view>
					</view>
				</view>
			</view>
		</block>
		<block v-if="TabCur == 'homeLjflzn'">
			<view class="bg-white padding" style="padding:5px 15px">
				<view class="grid margin-bottom text-center" :class="'col-' + 2">
					<view
						@click="navToLjflzn('/pages/home/khry/flzn/index?options='+encodeURIComponent(JSON.stringify(item)))"
						class="padding item itemLjfl"
						:class="indexs % 2 == 0 ? 'bg-cyan' : 'bg-blue'"
						v-for="(item, indexs) in homeLjflzn"
						:key="indexs"
						:style="{ backgroundImage: 'url(' + item.refuseImg + ')' }"
					>
						{{ item.refuseName }}
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	const baseUrl = require('@/common/vmeitime-http');
export default {
	props: {
		TabCur: String,
		homeLayout: Array,
		homeLjflzn: Array
	},
	data() {
		return {
			CustomBar: this.CustomBar,
			avatar: [
				'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
				'https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg',
				'https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg',
				'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
			],
			baseUrl:baseUrl.baseUrl,
			tabNav: ['Flex布局', 'Grid布局', '辅助布局']
		};
	},
	created(){
		// console.log(this.homeLayout)
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		},
		navToKh(item) {
			//跳转页面
			if(item.checked == '0'){
				uni.navigateTo({
					url: item.path
				});
			}
		},
		navToLjflzn(item) {
			//跳转页面
			uni.navigateTo({
				url: item
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	// padding-top: 45px;
	.item {
		height: 150upx;
		background: #ffffff;
		box-shadow: 0px 0px 26upx 1upx rgba(22, 152, 68, 0.18);
		border-radius: 16upx;
		margin-top: 20upx;
		padding: 10px 10px;
	}
	.gary{	
		background: #EBEBEB;
	}
	.itemLjfl {
		height: 200upx;
		box-shadow: 0px 0px 0upx 0upx rgba(22, 152, 68, 0);
		background-size: 100% 100%;
		line-height: 190upx;
		text-align: left;
		font-size: 30upx;
	}
	.grid.col-2 > uni-view {
		width: 48%;
	}
	.item:nth-child(even) {
		margin-left: 4%;
	}
	.left,
	.right {
		width: 60%;
		float: left;
		// background-color: red;
		height: 100%;
		view {
			text-align: left;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			font-size: 28upx;
			line-height: 30upx;
			height: 52%;
			margin-top: 1%;
		}
		.small-text {
			height: 44%;
			font-size: 22upx;
			line-height: 26upx;
			margin-top: 10upx;
		}
	}
	.right {
		width: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			width: 104upx;
			height: 104upx;
		}
		// background-color: green;
	}
}
</style>
