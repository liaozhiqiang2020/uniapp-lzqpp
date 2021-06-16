<template name="zy-search">
	<view>
		<view class="search">
			<!-- #ifdef APP-PLUS -->
			<text @click="startRecognize()" class="voice-icon cuIcon-voicefill"></text>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button @touchstart="streamRecord" @touchend="streamRecordEnd" class="echo-btn cuIcon-voice" :class="isSpeaking ? 'orange' : 'green'"></button>
			<!-- #endif -->
			<template v-if="isFocus">
				<input maxlength="20" focus type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索" v-model.trim="searchText" />
			</template>
			<template v-else>
				<input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索" v-model.trim="searchText" />
			</template>
			<text @click="searchStart()" class="search-icon cuIcon-search"></text>
			<!-- <image src="../../static/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image> -->
		</view>
		<!-- <view :class="'s-' + theme" v-if="hList.length > 0">
			<view class="header">
				历史记录
				<image src="../../static/zy-search/delete.svg" mode="aspectFit" @click="delhistory"></image>
			</view>
			<view class="list">
				<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view>
		<view :class="'wanted-' + theme" v-if="showWant">
			<view class="header">猜你想搜的</view>
			<view class="list">
				<view v-for="(item,index) in hotList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view> -->
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
const plugin = requirePlugin('WechatSI');
const voicManager = plugin.getRecordRecognitionManager();
// #endif
export default {
	name: 'zy-search',
	props: {
		isFocus: {
			//是否自动获取焦点
			type: Boolean,
			default: false
		},
		theme: {
			//选择块级显示还是圆形显示
			type: String,
			default: 'block'
		},
		showWant: {
			//是否展示推荐菜单
			type: Boolean,
			default: false
		},
		hotList: {
			//推荐列表数据
			type: Array,
			default() {
				return [];
			}
		},
		speechEngine: {
			//语音引擎=>讯飞:iFly,百度:'baidu'
			type: String,
			default: 'baidu'
		}
	},
	data() {
		return {
			isSpeaking: false,
			searchText: '', //搜索关键词
			hList: uni.getStorageSync('search_cache') //历史记录
		};
	},
	onLoad() {
		this.initRecord();
	},
	methods: {
		searchStart: function() {
			//触发搜索
			let _this = this;
			// if (_this.searchText == '') {
			// 	uni.showToast({
			// 		title: '请输入关键字',
			// 		icon: 'none',
			// 		duration: 1000
			// 	});
			// } else {
				_this.$emit('getSearchText', _this.searchText);
				// uni.getStorage({
				// 	key: 'search_cache',
				// 	success(res) {
				// 		let list = res.data;
				// 		if (list.length > 5) {
				// 			for (let item of list) {
				// 				if (item == _this.searchText) {
				// 					return;
				// 				}
				// 			}
				// 			list.pop();
				// 			list.unshift(_this.searchText);
				// 		} else {
				// 			for (let item of list) {
				// 				if (item == _this.searchText) {
				// 					return;
				// 				}
				// 			}
				// 			list.unshift(_this.searchText);
				// 		}
				// 		_this.hList = list;
				// 		uni.setStorage({
				// 			key: 'search_cache',
				// 			data: _this.hList
				// 		});
				// 	},
				// 	fail() {
				// 		_this.hList = [];
				// 		_this.hList.push(_this.searchText);
				// 		uni.setStorage({
				// 			key: 'search_cache',
				// 			data: _this.hList
				// 		});
				// 		_this.$emit('getSearchText', _this.searchText);
				// 	}
				// });
			// }
		},
		keywordsClick(item) {
			//关键词搜索与历史搜索
			this.searchText = item;
			this.searchStart();
		},
		delhistory() {
			//清空历史记录
			this.hList = [];
			uni.setStorage({
				key: 'search_cache',
				data: []
			});
		},
		startRecognize() {
			//语音输入
			let _this = this;
			let options = {};
			options.engine = _this.speechEngine;
			options.punctuation = false; // 是否需要标点符号
			options.timeout = 10 * 1000;
			plus.speech.startRecognize(options, function(s) {
				_this.searchText = _this.searchText + s;
			});
		},
		streamRecord() {
			voicManager.start({
				lang: 'zh_CN'
			});
			uni.vibrateShort();
			this.searchText = '正在聆听中...';
			this.isSpeaking = true;
		},
		streamRecordEnd: function() {
			voicManager.stop();
			uni.vibrateShort();
			this.isSpeaking = false;
			// console.log(1)
			this.initRecord();
		},
		initRecord() {
			let that = this;
			//有新的识别内容返回，则会调用此事件
			// voicManager.onRecognize = (res) => {
			//  let text = res.result
			//  this.currentText=text;
			// }
			// 识别结束事件
			voicManager.onStop = res => {
				let text = res.result;
				that.searchText = text;
				// this.currentText = text;
				// 这里得到完整识别内容就可以去翻译了
				// this.translateTextAction();
			};
		}
	}
};
</script>

<style lang="less" scoped>
.search {
	width: 680upx;
	margin: 10upx auto 40upx;
	position: relative;
	height: 70upx;
	display: flex;
	border: 1upx solid #999999;
	background-color: #f7f7f7;
	border-radius: 15upx;
	align-items: center;
	input {
		// padding: 35upx 74upx;
		height: 70upx;
		font-size: 28upx;
		width: 640upx;
		padding-left: 20upx;
		// text-align: center;
		/*  #ifdef  APP-PLUS  */
		padding-left: 20upx;
		/*  #endif  */
		/*  #ifdef  !APP-PLUS  */
		padding-left: 20upx;
		/*  #endif  */
	}
	.voice-icon {
		width: 36upx;
		height: 36upx;
		padding: 16upx 20upx 16upx 0;
		position: absolute;
		left: 16upx;
		top: -1upx;
		font-size: 30upx;
		z-index: 10;
		opacity: 0.8;
	}
	.search-icon {
		width: 36upx;
		height: 36upx;
		padding: 16upx 20upx 16upx 0;
		position: absolute;
		right: 10upx;
		font-size: 30upx;
		top: -4upx;
		z-index: 10;
	}
}
.s-block {
	margin-top: 30upx;
	.header {
		font-size: 32upx;
		padding: 30upx;
		position: relative;
		image {
			width: 36upx;
			height: 36upx;
			padding: 10upx;
			position: absolute;
			right: 40upx;
			top: 24upx;
		}
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		view {
			width: 50%;
			color: #8a8a8a;
			font-size: 28upx;
			box-sizing: border-box;
			text-align: center;
			padding: 20upx 0;
			border-top: 2upx solid #fff;
			border-left: 2upx solid #fff;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			background-color: #f7f7f7;
		}
	}
}
.s-circle {
	margin-top: 30upx;
	.header {
		font-size: 32upx;
		padding: 30upx;
		border-bottom: 2upx solid #f9f9f9;
		position: relative;
		image {
			width: 36upx;
			height: 36upx;
			padding: 10upx;
			position: absolute;
			right: 40upx;
			top: 24upx;
		}
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx 20upx;
		view {
			padding: 8upx 30upx;
			margin: 20upx 30upx 0 0;
			font-size: 28upx;
			color: #8a8a8a;
			background-color: #f7f7f7;
			box-sizing: border-box;
			text-align: center;
			border-radius: 20upx;
		}
	}
}
.wanted-block {
	margin-top: 30upx;
	.header {
		font-size: 32upx;
		padding: 30upx;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		view {
			width: 50%;
			color: #8a8a8a;
			font-size: 28upx;
			box-sizing: border-box;
			text-align: center;
			padding: 20upx 0;
			border-top: 2upx solid #fff;
			border-left: 2upx solid #fff;
			background-color: #f7f7f7;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
.wanted-circle {
	margin-top: 30upx;
	.header {
		font-size: 32upx;
		padding: 30upx;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx 20upx;
		view {
			padding: 8upx 30upx;
			margin: 20upx 30upx 0 0;
			font-size: 28upx;
			color: #8a8a8a;
			background-color: #f7f7f7;
			box-sizing: border-box;
			text-align: center;
			border-radius: 20upx;
		}
	}
}
.echo-btn {
	background-color: rgba(0, 0, 0, 0);
	border: none;
}
.echo-btn::after {
	border: none;
}
</style>
