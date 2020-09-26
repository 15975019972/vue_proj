<template>
  <div class="login">
      <div class="login-box">
        <div class="login-icon">
          <img src="~assets/logo.png" alt="">
        </div>
     <el-form ref="loginRef" :model="login" label-width="80px" label-position='top' :rules="loginRules">
          <el-form-item  prop='username'>
        <el-input v-model="login.username" placeholder="请输入内容" prefix-icon='iconfont icon-zhanghao'></el-input>
       </el-form-item>
         <el-form-item prop='password'>
           <el-input v-model="login.password" placeholder="请输入内容" prefix-icon='iconfont icon-mima' type="password"></el-input>
         </el-form-item>
     </el-form>
     <div class="login-btn">
     <el-button type="primary" @click="loginForm">登陆</el-button>
     <el-button type="info" @click="resetForm">重置</el-button>
     </div>
      </div>
  </div>
</template>

<script>
export default {
    name:"Login",
    data(){
      return {
        login:{
          username:'admin',
          password:'123456'
        },
        loginRules:{
            username:[
               { required: true, message: '请输入用户名', trigger: 'blur' },
               { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
            ]
        }
      }
    },
    methods:{
     resetForm(){
      //  this.$refs.loginRef.resetFields();
       this.login.username=''
       this.login.password=''
     },
     async loginForm(){
      const {data:res}=await this.$http.post('login',this.login)
         if(res.meta.status!==200){
           return this.$message.error('账号或者密码错误')
         }
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
     }
    }

}
</script>

<style lang='less' scoped>
.login{
  width: 100%;
  height: 100%;
  background: #44c089;
}
.login-box{
  width: 450px;
  height: 300px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%);
  padding: 0 40px;
  box-sizing: border-box;
  
}
.login-icon{
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 130px;
  height: 130px;
  border: 1px solid #ccc;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 75px;
  padding: 8px;
  background: #fff;
  box-shadow: 1px 5px 20px #ccc;
}
.login-icon img{
  width: 100%;
  height: 100%;
   background: #eee;
  border-radius: 75px;
}
.el-form{
  margin-top: 100px;
}
.login-btn{
  float: right;
}
</style>