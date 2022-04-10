
// import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from './store'

import lodash from 'lodash'

// element-ui
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
// Vue.use(Element)

import '@/assets/theme/index.css'

import '@/assets/icon/iconfont.css'

import {formatTime} from "./utils/time";


Vue.config.productionTip = false



Object.defineProperty(Vue.prototype, '$_', { value: lodash })


Vue.directive('title',  function (el, binding) {
  document.title = el.dataset.title
})
// 格式话时间
Vue.filter('format', formatTime)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
