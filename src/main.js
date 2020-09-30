import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import _ from  'lodash'

// 解决双击router.push 报错问题
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

// 引入echars可视化

// 引入富文本编辑器

import 'quill/dist/quill.snow.css'

// 加载table-tree
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

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

Vue.filter('dataFormat',function(originVal){
    const dt=new Date(originVal*1000)
    const y=dt.getFullYear();
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')
    const hh=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const ss=(dt.getMinutes()+'').padStart(2,'0')
    return `${y}-${m}-${d}:${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
