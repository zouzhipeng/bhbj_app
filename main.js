import Vue from 'vue'
import App from './App'


import custom from './pages/index/custom.vue'
Vue.component('custom',custom)

import home from './pages/index/home.vue'
Vue.component('home',home)

import center from './pages/user/center.vue'
Vue.component('center',center)

import loginbox from './pages/index/loginbox.vue'
Vue.component('loginbox',loginbox)

import rollorder from './components/roll-order.vue'
Vue.component('rollorder',rollorder)

import parser from "@/components/jyf-parser/jyf-parser"; // HBuilderX 2.5.5 及以上可以不需要
Vue.component('jyf-parser', parser)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
