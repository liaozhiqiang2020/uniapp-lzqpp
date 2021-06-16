import Vue from 'vue'
import Vuex from 'vuex'
import $mConstDataConfig from '@/config/constData.config';
import $mSettingConfig from '@/config/setting.config';
Vue.use(Vuex)
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFERRER = uni.getStorageSync('referrer') || '';
const USER = uni.getStorageSync('user') || {};
const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';
const GLOBALCONFIG = uni.getStorageSync('globalConfig') || {};
const CARTNUM = uni.getStorageSync('cartNum') || 0;
const NOTIFYNUM = uni.getStorageSync('notifyNum') || 0;
const IMHISTORY = uni.getStorageSync('imHistory') || [];
const IMNOREAD = uni.getStorageSync('imNoRead') || 0;
// const DAYNIGHTMODE = uni.getStorageSync('DayNightMode');
const THEMECOLOR = uni.getStorageSync('themeColor');
const store = new Vuex.Store({
	state: {
		// 用户token
		accessToken: ACCESSTOKEN,
		// 用户信息
		userInfo: {"roles":[""]},

		// 推荐人
		referrer: REFERRER,
		// 小程序openid
		openId: '',
		// 网络状态，用于下载提醒
		networkState: 'unknown',
		globalConfig: GLOBALCONFIG,
		refreshToken: REFRESHTOKEN,
		// 购物车数字角标
		cartNum: CARTNUM,
		// 消息中心数字角标
		notifyNum: NOTIFYNUM,
		// 历史聊天消息，仅保存最后100条
		imHistory: IMHISTORY,
		// 当前未读聊天消息数量
		imNoRead: IMNOREAD,
		// 当前是否处于聊天面板
		isImPanel: false,
		// 当前是否人工客服服务
		isStuffService: false,
		// DayNightMode: DAYNIGHTMODE,
		themeColor: THEMECOLOR,
		hasLogin: false,
		number: 0,
		code: "",
	},
	getters: {
		themeColor: state => {
			let theme = state.themeColor;
			if (!theme) {
				theme = $mConstDataConfig.themeList.filter((item) => item.name === ($mSettingConfig.styleType || 'rf'))[0];
			}
			return theme;
		},
		// DayNightMode: state => { //检测模式
		// 	let DayNight = state.DayNightMode;
		// 	if (!DayNight) {
		// 		DayNight = $mConstDataConfig.DayNightModeList.filter((item) => item.name === ($mSettingConfig.styleType || 'rf'))[
		// 			0];
		// 	}
		// 	return DayNight;
		// },
		// 全局配置
		globalConfig: state => {
			return state.globalConfig;
		},
		// 获取网络状态
		networkStatus: state => {
			return state.networkState;
		},
		// 判断用户是否登录
		hasLogin: state => {
			return !!state.accessToken;
		}
	},
	mutations: {
		login(state, provider) { //登录
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorageSync('userInfo', provider);
		},
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		},
	},
	actions: {
		globalConfigChange({
			commit
		}, info) {
			commit('setGlobalConfig', info);
		},
		networkStateChange({
			commit
		}, info) {
			commit('setNetworkState', info);
		},
		logout({
			commit
		}) {
			commit('logout');
		},
	}
})

export default store
