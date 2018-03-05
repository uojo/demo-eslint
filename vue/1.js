import Vue from 'vue'
import Vuex from 'vuex'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

// import ListPage from './ListPage'
import FormStoreConf from './store/store'
import routeConfig from './routeConfig'

import VeeValidate from 'vee-validate'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VeeValidate)

var d1 = {
a:1,
b:2
}

const store = new Vuex.Store(FormStoreConf)
const router = new VueRouter({
  routes: routeConfig
})

// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
new Vue({
  el: '#app',
	// render: (h) => h(ListPage),
  store,
  router
})

Vue.config.devtools = true

