import Vue from 'vue'
import App from './App'
import store from './store'
import $mConstDataConfig from '@/config/constData.config.js';
// import {router,RouterMount} from './router.js'  //路径换成自己的
// Vue.use(router)

import UniRouteGuards from 'uniapp-route-guards';
Vue.use(UniRouteGuards);

Vue.prototype.$mConstDataConfig = $mConstDataConfig;

import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
Vue.component('uni-load-more', uniLoadMore)

import noData from "@/basics/noData.vue"
Vue.component('noData', noData)

import NavBar from '@/components/lz-navBar/navBar.vue'
Vue.component("NavBar", NavBar);

import http from '@/common/vmeitime-http/'
Vue.prototype.$http = http
import basics from './basics/home.vue'
Vue.component('basics', basics)
import uniIcons from './uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
Vue.component('uniIcons', uniIcons)
import uniList from './uni_modules/uni-list/components/uni-list/uni-list.vue'
Vue.component('uniList', uniList)
import uniListItem from './uni_modules/uni-list/components/uni-list-item/uni-list-item.vue'
Vue.component('uniListItem', uniListItem)
import components from './component/home.vue'
Vue.component('components', components)
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)
import $mSettingConfig from '@/config/setting.config.js';
Vue.config.productionTip = false

App.mpType = 'app'

//加载
import ourLoading from '@/components/our-loading/our-loading.vue'
Vue.component('ourLoading', ourLoading)
Vue.prototype.$mSettingConfig = $mSettingConfig;
// 挂载全局自定义方法
Vue.prototype.$mStore = store;
Vue.prototype.$store = store;
const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$api = {
	prePage,
	msg
};
Vue.mixin({
	computed: {
		themeColor: {
			get() {
				return store.getters.themeColor;
			},
			set(val) {
				store.state.themeColor = val;
			}
		},
		DayNightMode: {
			get() {
				return store.getters.DayNightMode;
			},
			set(val) {
				store.state.DayNightMode = val;
			}
		}
	}
});

const guard = new UniRouteGuards();

// 自定义路由拦截白名单
const WHILE_LIST = ['/src/pages/home', '/src/pages/log'];

// 跳过路由白名单拦截
guard.beforeEach((to, from, next) => {
	if (WHILE_LIST.includes(from.url)) {
		return next(to.url);
	}

	next();
});

// 拦截 调用 uni.switchTab 页面C并跳转到 页面D
guard.afterEach((to, from, next) => {
	// console.log('to: ', to);
	// console.log('from: ', from);
	// if (to.url != '/pages/login/login') {
	// 	let that = this;
	// 	if (uni.getStorage('userInfo')) {
	// 		uni.getStorage({
	// 			key: 'userInfo',
	// 			success: function(res) {
	// 				if (JSON.stringify(res.data) == {}) {
	// 					uni.reLaunch({
	// 						url: "/pages/login/login"
	// 					});
	// 				} 
	// 			},
	// 			fail: function(err) {
	// 				uni.reLaunch({
	// 					url: "/pages/login/login"
	// 				});
	// 			},
	// 		});
	// 	}

	// }
});


const app = new Vue({
	...App,
	store: store,
	// RouterMount,
	// router
})
app.$mount()
