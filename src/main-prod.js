import Vue from 'vue'
import App from './App.vue'
import router from './router'

import NProgress from 'nprogress'

import echarts from 'echarts'

import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
//element ui js
// import './plugins/element.js'

// 自定义全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.prototype.$echarts = echarts

Vue.component('tree-table', TreeTable)

import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor /* { default global options } */)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')