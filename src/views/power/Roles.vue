<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>权限管理</el-breadcrumb-item>
     <el-breadcrumb-item>角色列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
       <el-row>
          <el-col :span="4">
            <el-button type="primary" @click="c_roleAddDialogVisible">添加角色</el-button>
          </el-col>   
       </el-row>   
       <el-table :data="roleList" border stripe>
         <!-- 展开页 -->
         <el-table-column type="expand">
           <template #default='scope'>
             <el-row v-for="(item1,i1) in scope.row.children" :key="i1" style="border-top:1px solid #ccc" class="fx">
             <el-col :span="5" class="col-p">
               <el-tag>
                 {{item1.authName}}
               </el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
             <el-col :span="19">
                 <el-row v-for="(item2,i2) in item1.children" :key="i2" style="border-bottom:1px solid #ccc;" class="fx">
                   <el-col :span="6" class="col-p">
                     <el-tag type="warning">
                     {{item2.authName}}
                     </el-tag>
                     <i class="el-icon-caret-right"></i>
                   </el-col>
                   <el-col :span="18" class="col-p">
                     <el-tag v-for="(item3,i3) in item2.children" :key="i3" type="success" class="mg-l">{{item3.authName}}</el-tag>
                   </el-col>
                 </el-row>
              </el-col>
            </el-row>
           </template>
         </el-table-column>
         <el-table-column label="#" type="index">
         </el-table-column>  
         <el-table-column label="角色名称" prop="roleName"></el-table-column>  
         <el-table-column label="角色描述" prop="roleDesc"></el-table-column>  
         <el-table-column label="操作">
           <template #default='scope'>
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="c_roleEditDialogVisible(scope.row.roleName,scope.row.roleDesc,scope.row.id)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="c_deleteRoleInfoById(scope.row.id)">删除</el-button>
             <el-button type="warning" icon="el-icon-setting" size="mini" @click="c_AssignPower(scope.row)">分配权限</el-button>
           </template>
           </el-table-column>  
      </el-table> 
   </el-card>
     <!-- 添加角色 -->
   <el-dialog
  title="添加角色"
  :visible.sync="showRoleDialogVisible"
  width="50%" 
  @close='roleDialogClose'
  >
 <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="100px">
   <el-form-item label="用户名:" prop="roleName">
     <el-input v-model="roleForm.roleName"></el-input>
   </el-form-item>
     <el-form-item label="角色描述:" prop="roleDesc">
      <el-input v-model="roleForm.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitRoleInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑角色 -->
  <el-dialog
 title="添加角色"
 :visible.sync="showRoleDialogVisible"
 width="50%" 
 @close='roleDialogClose'
 >
<el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="100px">
  <el-form-item label="用户名:" prop="roleName">
    <el-input v-model="roleForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述:" prop="roleDesc">
     <el-input v-model="roleForm.roleDesc"></el-input>
   </el-form-item>
 </el-form>
 <span slot="footer" class="dialog-footer">
   <el-button @click="showRoleDialogVisible = false">取 消</el-button>
   <el-button type="primary" @click="commitEditRoleInfo">确 定</el-button>
 </span>
</el-dialog>
<!-- 分配权限 -->
  <el-dialog
  title="提示"
  :visible.sync="assigndDialogVisible"
  width="50%" @close='setRightsDialogClose'>
 <el-tree
  :data="allAssignTree"
  show-checkbox
  node-key="id"
   default-expand-all
  :default-checked-keys="defkeys"
  :props="treeProps" ref='rightsRef'>
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="assigndDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commit_rights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
   name:'Roles',
   data(){
     return {
       roleList:[],
       roleForm:{
         roleName:'',
         roleDesc:''
       },
       roleId:'',
       roleFormRules:{
         roleName:[
           { required: true, message: '请输入用户名', trigger: 'blur' }
         ],
         roleDesc:[
           { required: true, message: '请输入描述信息', trigger: 'blur' }
         ]
       },
       showRoleDialogVisible:false,
       assigndDialogVisible:false,
       allAssignTree:[],
        treeProps:{
        label:"authName",
        children:'children'
      },
      // 这里递归出来的
      defkeys:[]
     }
   },
   created(){
      this.getRolesList()
   },
   methods:{
      async getRolesList(){
           const {data:res}=await this.$http.get('roles')
             if(res.meta.status!==200){
               return this.$message.error('获取角色列表失败!')
             }
             this.$message.success('获取角色列表成功!')
             this.roleList=res.data
            //  console.log(this.roleList);
      },
      c_roleAddDialogVisible(){
          this.showRoleDialogVisible=true
      },
      commitRoleInfo(){
          this.$refs.roleFormRef.validate(async valid=>{
           if(!valid){
             return 
           }
           const {data:res}=await this.$http.post('roles',this.roleForm)
              console.log(res);
             if(res.meta.status!==201){
               return this.$message.error('添加角色失败!')
             }
             this.$message.success('添加角色成功!')
            })
            this.getRolesList()
             this.showRoleDialogVisible=false
      },
      roleDialogClose(roleName,roleDesc,roleId){
        this.$refs.roleFormRef.resetFields()
      },
      c_roleEditDialogVisible(roleName,roleDesc,roleId){
            this.roleForm.roleName=roleName
            this.roleForm.roleDesc=roleDesc
            this.roleId=roleId
        this.showRoleDialogVisible=true
      },
      async commitEditRoleInfo(){
         console.log(this.roleId);
          const{data:res}=await this.$http.put(`roles/${this.roleId-0}`,this.roleForm)
          console.log(res);
          if(res.meta.status!==200){
            return this.$message.error('编辑角色信息失败')
          }
           this.$message.success('编辑角色信息成功')
           this.getRolesList()
           this.showRoleDialogVisible=false
      },
     async c_deleteRoleInfoById(id){
          const confirmInfo=await this.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmInfo!=='confirm'){
          return
        }
        const {data:res}=await this.$http.delete(`roles/${id}`)
        if(res.meta.status!==200){
          return this.$message.error('删除用户信息失败!')
        }
        this.$message.success('删除用户信息成功!')
        this.getRolesList()
    },
    // 请求所有的tree节点
    async allAssignPower(){
        const{data:res}=await this.$http.get('rights/tree')
          if(res.meta.status!==200){
            return this.$message.error('获取所有的权限列表失败!')
          }
          this.allAssignTree=res.data
            // console.log(res);
    },
    // 递归默认选中的key
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    c_AssignPower(row){
       this.roleId=row.id
       this.getLeafKeys(row,this.defkeys)
        this.allAssignPower()
      this.assigndDialogVisible=true
    },
    async commit_rights(){
       const keys=[
         ...this.$refs.rightsRef.getCheckedKeys(),
         ...this.$refs.rightsRef.getHalfCheckedKeys()
       ]
       const idStr=keys.join(',')
      //  console.log(idStr);
       const{data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
         if(res.meta.status!==200){
           return this.$message.error('更新失败!')
         }
         this.$message.success('更新成功!')
         this.getRolesList()
         this.assigndDialogVisible=false
    },
    setRightsDialogClose(){
      this.defkeys=[];
    }
   }
}
</script>

<style lang='less' scoped>
 .fx{
   display: flex;
   justify-content: center;
   align-items: center;
 }
 .col-p{
   padding: 10px;
 }
 .mg-l{
   margin-left: 20px;
   margin-top: 5px;
 }
</style>