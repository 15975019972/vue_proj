import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login=()=>import('views/login/Login.vue')
const Welcome=()=>import('views/welcome.vue')
const Home=()=>import('views/Home.vue')
const User=()=>import('views/user/User.vue')
const Roles=()=>import('views/power/Roles.vue')
const Rights=()=>import('views/power/Rights.vue')
const GoodsList=()=>import('views/goods/GoodsList.vue')
const Params=()=>import('views/goods/Params.vue')
const Categories=()=>import('views/goods/Categories.vue')
const Order=()=>import('views/order/Order.vue')
const Report=()=>import('../views/reports/Reports.vue')


const routes = [
   {
      path:'',
      redirect: '/login'
   },{
     path:'/login',
     component:Login
   },
   {
      path:'/home',
      component:Home,
      children:[
        {
          path:'',
          redirect: '/welcome'
        },
        {
          path:'/welcome',
          component:Welcome
        },{
          path:'/users',
          component:User
        },{
          path:'/roles',
          component:Roles
        },{
          path:'/rights',
          component:Rights
        },{
          path:'/goods',
          component:GoodsList
        },{
          path:"/params",
          component:Params
        },{
          path:'/categories',
          component:Categories
        },{
          path:'/orders',
          component:Order
        },{
          path:'/reports',
          component:Report
        }
      ]
   }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL

})
router.beforeEach((to,from,next)=>{
        console.log(to.path);
    if(to.path==='/login'){
      return next()
    }
    const token=window.sessionStorage.getItem('token')
    if(!token) return next();
    next()
    
})

export default router
