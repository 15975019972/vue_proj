<template>
  <div>
  <el-container>
    <!-- 这里是头部 -->
  <el-header>
     <div class="h-login">
       <img src="~assets/logo.png" alt="">
       <span>小v后台</span>
     </div>
     <el-button size="mini" @click="loginOut">退出</el-button>
  </el-header>
  <!-- 这里是侧边栏
   -->
  <el-container>
    <el-aside :width="sw_wid">
          <div class="toggle-tab" @click="toggle_c">VVV</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      class="el-menu-vertical-demo"
      :unique-opened='true'
      :collapse='is_collapse'
      :collapse-transition='false'
      >
      <el-submenu :index="index.toString()" v-for="(item,index) in asideItem" :key="index">
        <template slot="title">
          <i :class="icon[index]"></i>
          <span class="aside-name">{{item.name}}</span>
        </template>
          
           <el-menu-item  :index="idx.toString()" v-for="(it,idx) in item.children" :key="idx" @click="toggleUrl(item.path[idx])"><i :class="icon[index]"></i>{{it}}</el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
export default {
 name:'Home',
 data(){
   return{
       asideItem:[
          {
            name:'用户管理',
            children:['用户列表'],
            icon:'',
            path:['/users']
          },{
             name:'权限管理',
             children:['角色管理','权限管理'],
             path:['/roles','/rights']
          },{
            name:'商品管理',
           children:['商品列表','分类参数','商品分类'],
           path:['/goods','/params','/categories']
          },{
              name:'订单管理',
              children:['订单列表'],
              path:['/orders']
          },{
             name:'数据统计',
           children:['数据报表'],
           path:['/reports']
          }
       ],
       icon:['iconfont icon-yonghuguanli','iconfont icon-dingdanguanli','iconfont icon-shangpinguanli','iconfont icon-quanxianguanli','iconfont icon-shujutongji'],
       is_collapse:false,
   }
 },
 methods:{
      loginOut(){
         window.sessionStorage.removeItem('token')
         this.$router.push('/login')
        //  console.log('111');
      },
      toggleUrl(path){
        this.$router.push(path)
      },
      toggle_c(){
        this.is_collapse=!this.is_collapse;
      },

 },
 computed:{
      sw_wid(){
        return this.is_collapse?'65px':'200px';
      }
 }
}
</script>

<style lang='less' scoped>
.el-header{
  height: 60px;
  background: #373d41;
}
.el-aside{
  width: 200px;
  background: #333744;
  min-height: 700px;
}
.h-login{
   display: flex;
   align-items: center;
}
.h-login img{
  width: 80px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
}
.h-login span{
  font-size: 18px;
  color: #fff;
  margin-left: 30px;
}
.el-button{
  position: absolute;
  top: 14px;
  right: 30px;
}
.aside-name{
  margin-left: 10px;
}
.toggle-tab{
  color: #fff;
  text-align: center;
  background: #485165;
}
.el-menu{
  border: 0;
}
</style>