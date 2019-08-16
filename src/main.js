// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import newApp from './newApp'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';//element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'; //element-ui的css
Vue.use(ElementUI) //使用elementUI

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// import login from  '@/views/Login/login'

Vue.config.productionTip = false       //这句是防止在生产环境中产生过多的log输出

//import cookies from 'js-cookie'


import axios from 'axios'
// 挂载到vue原型链上
Vue.prototype.axios = axios
//Vue.prototype.cookies=cookies


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { newApp },
  template: '<newApp/>'    /*首页Navi*/

})
