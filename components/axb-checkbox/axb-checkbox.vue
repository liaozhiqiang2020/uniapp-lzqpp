<template>
	<view class="style-flex style-flex-wrap">
		<view class="radio" :style="idx == indexOf ? activeStyle : itemStyle" @click="handleChange($event, idx)" v-for="(item, idx) in items">
			<text class="cuIcon-camerafill iconcamera"></text>
			<view>{{ item.dictLabel }}</view>
		</view>
	</view>
</template>

<script>
import filterRadioItem from './axb-checkbox-item.vue';
export default {
	props: {
		list: {
			type: Array,
			default: []
		},
		type: {
			type: Number,
			default: 0
		},
		multi: {
			type: Boolean,
			default: false
		}
	},
	components: {
		filterRadioItem
	},
	data() {
		return {
			items: this.list,
			resMulti: [],
			indexOf: -1,
			activeStyle: 'background: #379D51;color: #ffffff;border-color: #379D51',
			itemStyle: 'background: #ffffff;color: #379D51;border-color: #379D51'
		};
	},
	methods: {
		handleChange(e, index) {
			this.indexOf = index;
			this.$emit('change', this.items[index].dictValue, this.type);
		},
		radioChange: function(e, index) {
			this.handleChange(e, index);
			this.$emit('change', e, this.type);
		},
		reset: function() {
			this.items = this.list;
		},
		setItems: function(val) {
			this.items = val;
		}
	}
};
</script>

<style lang="scss" scoped>
.radio {
	display: inline-block;
	height: 80upx;
	line-height: 80upx;
	padding: 0 22upx;
	background: #f7f7f7;
	border: 1px solid #c3c3c3;
	border-radius: 10upx;
	font-size: 26upx;
	color: #7d7d7d;
	box-sizing: border-box;
}
.radio:not(:last-child) {
	margin: 0 20upx 30upx 0;
}
.radio-primay {
	background: #379d51;
	color: #ffffff;
	border: 1px solid #379d51;
}
.radio-width-default {
	width: 120upx;
	text-align: center;
	padding: 0;
}
.radio {
	display: inline-flex !important;
	height: 80upx;
	line-height: 80upx;
	padding: 10upx 40upx;
	border-radius: 10upx;
	font-size: 28upx;
	align-items: center;
	color: #379d51;
	margin: 0 10px 15px 0;
	width: 336upx;
	justify-content: center;
	box-sizing: border-box;
	border: 1px solid #c3c3c3;
	.iconcamera {
		font-size: 34upx;
		margin-right: 10upx;
	}
	view {
		max-width: 265upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.radio-width-default {
	width: 120upx;
	text-align: center;
	padding: 0;
}
</style>
