import http from './interface'
import {
	mapState,
	mapMutations
} from 'vuex';
import Vue from 'vue'
import store from '../../store'
let _this = this
const app = new Vue()

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
// http://http://ljfl.cyberbase.com.cn
var baseUrl = '/ksy'
if (process.env.NODE_ENV === 'development') {
	// #ifdef !H5
	baseUrl = 'https://lzqpp.natapp4.cc'
	// #endif

	// #ifdef H5
	baseUrl = '/ksy'
	// #endif
} else {
	// #ifdef !H5
	baseUrl = 'https://lzqpp.natapp4.cc'
	// #endif

	// #ifdef H5
	baseUrl = 'https://lzqpp.natapp4.cc'
	// #endif

}
// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const testPost = (url, data) => {
	// http.config.baseUrl = "http://localhost:13343/api/"
	//设置请求前拦截器
	// var obj = {}
	// if (uni.getStorageSync('userInfo')) {
	// 	obj = uni.getStorageSync('userInfo')
	// 	http.interceptor.request = (config) => {
	// 		config.header = {
	// 			"Authorization": obj.token
	// 		}
	// 	}
	// }

	// //设置请求结束后拦截器
	// http.interceptor.response = (response) => {
	// 	if (response.statusCode == 200) {
	// 		// console.log(response)
	// 		if (response.data.code == 401) {
	// 			app.$api.msg('登录失效 ！')
	// 			setTimeout(() => {
	// 				app.$mStore.commit('logout');
	// 				uni.reLaunch({
	// 					url: "/pages/login/login"
	// 				});
	// 			}, 2000);
	// 			return false

	// 		}
	// 		if (response.data.code != 200 && response.data.code != 401) {
	// 			// app.$api.msg(response.data.msg)
	// 		}
	// 	}

	// 	//判断返回状态 执行相应操作
	// 	return response;
	// }
	return http.request({
		baseUrl: baseUrl,
		url: url,
		method: 'POST',
		// dataType: 'text',
		data,
	})
}

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const testGet = (url, data) => {
	// http.config.baseUrl = "http://localhost:13343/api/"
	//设置请求前拦截器
	// var obj = {}
	// if (uni.getStorageSync('userInfo')) {
	// 	obj = uni.getStorageSync('userInfo')
	// 	http.interceptor.request = (config) => {
	// 		config.header = {
	// 			"Authorization": obj.token
	// 		}
	// 	}
	// }

	// //设置请求结束后拦截器
	// http.interceptor.response = (response) => {
	// 	if (response.statusCode == 200) {
	// 		// console.log(response)
	// 		if (response.data.code == 401) {
	// 			app.$api.msg('登录失效 ！')
	// 			setTimeout(() => {
	// 				app.$mStore.commit('logout');
	// 				uni.reLaunch({
	// 					url: "/pages/login/login"
	// 				});
	// 			}, 2000);
	// 			return false
	// 		}
	// 		if (response.data.code != 200 && response.data.code != 401) {
	// 			// app.$api.msg(response.data.msg)
	// 		}
	// 	}
	// 	//判断返回状态 执行相应操作
	// 	return response;
	// }
	return http.request({
		baseUrl: baseUrl,
		url: url,
		method: 'GET',
		// dataType: 'text',
		data,
	})
}

// 轮播图
export const banner = (data) => {
	return http.request({
		url: '/banner/36kr',
		method: 'GET',
		data
	})
}
// 商品活动详情
export const commodityDatil = (data) => {
	return http.request({
		url: '/app/selectFindArticleDetail',
		method: 'POST',
		data
	})
}

export {
	baseUrl
}
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	testPost,
	testGet,
	banner,
	commodityDatil
}
