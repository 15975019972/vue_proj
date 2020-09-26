<template>
  <div>
    <!-- 面包屑导航 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>用户管理</el-breadcrumb-item>
           <el-breadcrumb-item>用户列表</el-breadcrumb-item>
         </el-breadcrumb>
          <el-card>
            <el-row :gutter="20">
              <el-col :span='8'>
                 <el-input placeholder="请输入内容"  class="input-with-select" v-model="qureyInfo.query" clearable @clear='getUserList'>
                <el-button slot="append" icon="el-icon-search" @click="c_search"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4"> 
                   <el-button type="primary" @click="c_addDialogVisible" >添加用户</el-button>
              </el-col>
            </el-row>
            <el-table :data="userList" stripe :border='true'>
               <el-table-column label="#" type="index"></el-table-column>
               <el-table-column  prop="username" label="姓名"></el-table-column>
               <el-table-column  prop="email" label="邮箱"></el-table-column>
               <el-table-column  prop="mobile" label="电话"></el-table-column>
               <el-table-column  prop="role_name" label="角色"></el-table-column>
               <el-table-column   label="状态" width="197px">
                <template #default='scope'>
                      <el-switch
                     v-model="scope.row.mg_state"
                      @change='userStatusCg(scope.row)'>
                    </el-switch>
                </template>
               </el-table-column>
               <el-table-column label="操作">
                  <template #default='scope'>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="c_showEditDialogVisible(scope.row.id,scope.row.email,scope.row.mobile)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click='c_deleteUserInfoById(scope.row.id)'></el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="c_setRoleDialogVisible(scope.row.username,scope.row.role_name,scope.row.id)"></el-button>
                  </template>
               </el-table-column>
             </el-table>

             <!-- 分页 -->
                <el-pagination
      @size-change="pagehandleSizeChange"
      @current-change="pagehandleCurrentChange"
      :current-page="qureyInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="qureyInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
         </el-card>
         <!-- 添加用户对话框 -->
   <el-dialog
     title="添加用户"
     :visible.sync="addShowDialogVisible"
     width="50%" 
     @close='addDialogClose'
     >
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
        <el-form-item label="密码:" prop="password">
         <el-input v-model="addForm.password"></el-input>
       </el-form-item>
       <el-form-item label="邮箱:" prop="email">
         <el-input v-model="addForm.email"></el-input>
       </el-form-item>
       <el-form-item label="手机号码:" prop="mobile">
         <el-input v-model="addForm.mobile"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
       <el-button @click="addShowDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="commitAddUserInfo">确 定</el-button>
     </span>
   </el-dialog>
  <!-- 修改用户信息dialog对话框 -->
     <el-dialog
     title="修改用户信息"
     :visible.sync="showEditDialogVisible"
     width="50%">
 <el-form :model="editUserForm" :rules="addFormRules" ref="editUserRef" label-width="100px" >
    <el-form-item label="id">
       <el-input v-model="editUserForm.id" disabled></el-input>
    </el-form-item>
     <el-form-item label="email" prop="email">
        <el-input v-model="editUserForm.email"></el-input>
    </el-form-item>
     <el-form-item label="mobile" prop="mobile">
       <el-input v-model="editUserForm.mobile"></el-input>
    </el-form-item>
 </el-form>
     <span slot="footer" class="dialog-footer">
       <el-button @click="showEditDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="commitEditInfo">确 定</el-button>
     </span>
   </el-dialog>

   <!--  setRole dialog-->
   <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close='setRoleDialogVisibleClose'
  >
   <p>当前用户:{{userName}}</p>
   <p>当前角色:{{rolesName}}</p>
    <el-select v-model="selectRoles" placeholder="请选择">
      <!-- 选择角色列表 -->
    <el-option
      v-for="item in rolesList"
      :key="item.id" 
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitSetRoleInfo()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
   name:"User",
   data(){
     const checkUserName=(rule,value,cb)=>{
        const userNameReg=/[A-Za-z0-9_\-\u4e00-\u9fa5]+/
        if(userNameReg.test(value)){
          return cb()
        }
        cb(new Error('亲输入正确的用户名!'))
     }
     const checkPassWord=(rule,value,cb)=>{
       const passWordReg= /^[a-zA-Z]\w{5,17}$/
         if(passWordReg.test(value)){
           return cb()
         }
         cb(new Error('请输入正确的密码!'))
     }
     const checkEmail=(rule,value,cb)=>{
        const emailReg=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
          if(emailReg.test(value)){
            return cb()
          }
          cb(new Error('请输入正确的邮箱'))
     }
     const checkMobile=(rule,value,cb)=>{
       const mobileReg=/^1[3|4|5|7|8][0-9]{9}$/
          if(mobileReg.test(value)){
            return cb()
          }
          cb(new Error('请输入正确的手机号码!'))
     }
     return{
       qureyInfo:{
          query:'',
          pagenum:1,
          pagesize:10
       },
       userList:[], 
       total:0,
       addShowDialogVisible:false,
       addForm:{
          username:"usdhu9w",
          password:'dwkao1245',
          email:'823565@qq.com',
          mobile:'15975011885'
       },
       addFormRules:{
           username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
           { validator: checkUserName, trigger: 'blur' }
           ],
           password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassWord, trigger: 'blur' }
           ],
           email:[
              { validator: checkEmail, trigger: 'blur' }
           ],
           mobile:[
            { min: 11, max: 11, message: '请输入长度为11的手机号码', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
           ]
       },
       editUserForm:{
           id:"",
           email:'',
           mobile:''
       },
       showEditDialogVisible:false,
      //  分配角色
       setRoleDialogVisible:false,
       userName:'',
       rolesName:'',
       userId:'',
       rolesList:[],
       selectRoles:'',
       
     }
   },
   created(){
       this.getUserList()
   },
   methods:{
     async getUserList(){
        const {data:res}=await this.$http.get('users',{params:this.qureyInfo})
         console.log(res);
         if(res.meta.status!==200){
           return this.$message.error('获取用户列表失败!')
         }
         this.$message.success('获取用户列表成功!')
         this.userList=res.data.users;
         this.total=res.data.total
     },
     pagehandleSizeChange(newSize){
       this.qureyInfo.pagesize=newSize
       this.getUserList()
     },
     pagehandleCurrentChange(newNum){
       this.qureyInfo.pagenum=newNum
       this.getUserList()
     },
     c_addDialogVisible(){
       this.addShowDialogVisible=true
     },
     commitAddUserInfo(){
        this.$refs.addFormRef.validate(async valid=>{
             if(!valid){
               return 
             }
             const {data:res}=await this.$http.post('users',this.addForm)
                console.log(res);
               if(res.meta.status!==201){
                 return this.$message.error('添加用户失败!')
               }
               this.$message.success('添加用户成功!')
        })
        this.addShowDialogVisible=false
     },
    addDialogClose(){
          this.$refs.addFormRef.resetFields()       
    },
    async userStatusCg(row){
      console.log(row);
        const {data:res}=await this.$http.put(`users/${row.id}/state/${row.mg_state}`);
        console.log(res);
        if(res.meta.status!==200){
            row.mg_state=!row.mg_state
          return this.$message.error('修改用户状态失败!')
        }
        this.$message.success('修改用户状态成功!')
    },
    c_showEditDialogVisible(id,email,mobile){
      this.editUserForm.id=id
      this.editUserForm.email=email;
      this.editUserForm.mobile=mobile
      this.showEditDialogVisible=true
    },
    commitEditInfo(){
        this.$refs.editUserRef.validate(async valid=>{
            if(!valid){
              return
            }
            const {data:res}=await this.$http.put(`users/${this.editUserForm.id}`,this.editUserForm)
             if(res.meta.status!==200){
               return this.$message.error('更新用户信息失败!')
             }
             this.$messae.success('更新用户信息成功!')
        })
    },
    async c_deleteUserInfoById(id){
      const confirmInfo=await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmInfo!=='confirm'){
          return
        }
        const {data:res}=await this.$http.delete(`users/${id}`)
        if(res.meta.status!==200){
          return this.$message.error('删除用户信息失败!')
        }
        this.$message.success('删除用户信息成功!')
        this.getUserList()
    },
    async c_setRoleDialogVisible(usn,rln,userId){
          this.userName=usn;
          this.rolesName=rln
          this.userId=userId
          const {data:res}=await this.$http.get(`roles`)
          if(res.meta.status!==200){
            return this.$message.error('获取角色列表失败!')
          }
          // console.log(res);
            this.rolesList=res.data
         this.setRoleDialogVisible=true
    },
    async commitSetRoleInfo(){
       const {data:res}=await this.$http.put(`users/${this.userId}/role`,{rid:this.selectRoles})
         if(res.meta.status!==200){
           return this.$message.error('设置角色权限失败!')
         }
        this.$message.success('设置角色权限成功!')
         this.getUserList();
        this.setRoleDialogVisible=false
    },
    setRoleDialogVisibleClose(){
      // console.log('1');
       this.rolesList=[],
       this.selectRoles=''
    },
    c_search(){
        this.getUserList()
    }
   },
}
</script>

<style lang='less' scoped>

</style>