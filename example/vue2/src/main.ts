import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'

import '@/assets/css/main.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */

Vue.use(Avue)
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
})
