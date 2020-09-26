import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 引入阿里图标库
import 'assets/css/font_bufdbrt4epk/iconfont.css'

// 导入全局样式
import 'assets/css/golbal.css'


// 网络请求相关
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.defaults.timeout=5000
axios.interceptors.request.use(config=>{
   const token=window.sessionStorage.getItem('token')
    config.headers.Authorization=token
   return config
})
  
Vue.prototype.$http=axios

// 按需导入element-ui组件
import element from './element/index'
import 'element-ui/lib/theme-chalk/index.css'

// 向原型添加message弹框组件
import { Message,MessageBox } from 'element-ui'
Vue.prototype.$confirm=MessageBox.confirm
Vue.prototype.$message=Message
Vue.config.productionTip = false

Vue.use(element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
