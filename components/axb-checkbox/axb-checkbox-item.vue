<template>
	<view class="radio" :style="checked?activeStyle :itemStyle" @click="handleChange">
		<text class="cuIcon-camerafill iconcamera"></text><view>{{dictLabel}}</view>
	</view>
</template>

<script>
	
	/**
 * 防抖
 * @param {*} fun 
 * @param {*} delay 
 * @param {*} immediate 
 */
const debounce = function (fun, delay, immediate) {
  var timer, lasttime, context, arg
  var later = function () {
    var now = new Date().getTime(),
      l = now - lasttime
    if (l < delay && l >= 0) {
      clearTimeout(timer)
      timer = setTimeout(later, delay - l)
    } else {
      clearTimeout(timer)
      timer = null
      if (!immediate) {
        fun.apply(context, arg)
        if (!timer) context = arg = null
      }
    }
  }
  return function () {
    context = this
    arg = arguments
    lasttime = new Date().getTime()
    var callNow = immediate && !timer
    if (!timer) timer=setTimeout(later, delay)
    if (callNow) {
      fun.apply(context, arg)
      context = arg = null
    }
  }
}
	export default {
		props: {
			dictLabel: {
				type: String,
				default: ''
			},
			value: {
				default: null,
			},
			checked: {
				type: [Boolean, Number],
				default: false
			},
		},
		computed: {
			widthDefault() {
				return this.dictLabel.length <= 3
			},
			activeStyle() {
				return `background: #379D51;color: #ffffff;border-color: #379D51;`
			},
			itemStyle() {
				return `background: #ffffff;color: #379D51;border-color: #379D51`
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleChange: debounce(handleChange, 200,true)
		}
	}

	function handleChange() {
		this.$emit('change', this.value)
	}
</script>

<style lang="scss" scoped>
	.radio {
		display: inline-flex!important;
		height: 80upx;
		line-height: 80upx;
		padding:10upx 40upx;
		border-radius: 10upx;
		font-size: 28upx;
		align-items: center;
		color:#379D51;
		margin:0 10px 15px 0;
		width: 336upx;
		justify-content: center;
		box-sizing: border-box;
		border: 1px solid #c3c3c3;
		.iconcamera {
			font-size:34upx;
			margin-right: 10upx;
		}
		view{
			max-width:265upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	// .radio:not(:last-child) {
	// 	margin: 0 20upx 30upx 0;
	// }


	.radio-width-default {
		width: 120upx;
		text-align: center;
		padding: 0;
	}
</style>
