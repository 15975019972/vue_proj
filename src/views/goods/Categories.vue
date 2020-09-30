<template>
  <div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-button type="primary" size="mini" class="addBtn" @click="addCateVisible">添加分类</el-button>
  <tree-table 
  :data='cateList'
  :columns="columns"
  :selection-type='false'
  :expand-type='false'
  index-text='#'
  :show-index='true' 
  border>
  <template #isOK='scope'>
    <i v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
    <i v-else class="el-icon-error"></i>
  </template>
  <template #sort='scope'>
      <el-tag v-if="scope.row.cat_level===0">一级</el-tag>      
      <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>      
      <el-tag v-else>三级</el-tag>
  </template>
  <template #handle='scope'>
     <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditDialogVisible(scope.row)"></el-button>
     <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCategoriesById(scope.row)"></el-button>
  </template>
  </tree-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="添加"
  :visible.sync="ShowAddCateDialogVisible"
  width="50%"
  >
<el-form ref="addCateformRef" :model="addForm" label-width="80px" :rules="addFormRules">
  <el-form-item label="活动名称" prop="cat_name">
    <el-input v-model="addForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="活动名称" class="a">
      <el-cascader
   v-model="cascaderSelectValue"
   :options="cateList"
   :props="cascaderProp"
   @change="handleChange"
   clearable
   >
 </el-cascader>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="ShowAddCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitCategories">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="提示"
  :visible.sync="editCateDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editCateRules" ref="editCateRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="活动名称" prop="name">
    <el-input v-model="editForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitEditCateInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
   name:'Categories',
   data(){
     return{
       queryInfo:{
         type:2,
         pagenum:1,
         pagesize:10
       },
       total:0,
       cateList:[],
       columns:[
         {
           label:'分类名称',
           prop:"cat_name"
         },{
           label:'是否有效',
           type:'template',
           template:'isOK'
         },{
           label:'排序',
           type:'template',
           template:'sort'
         },{
           label:'操作',
           type:'template',
           template:"handle"
         }
       ],
       ShowAddCateDialogVisible:false,
       addForm:{
         cat_name:'',
         cat_pid:0,
         cat_level:0
       },
       addFormRules:{
         cat_name:[
           { required: true, message: '请输入活动名称', trigger: 'blur' },
         ]
       },
       cascaderProp:{
         label:'cat_name',
         value:'cat_id',
         children:"children",
         expandTrigger: 'hover',
         checkStrictly:'true'
       },
       cascaderSelectValue:[],
       editCateDialogVisible:false,
       editForm:{
         cat_name:''
       },
       editCateRules:{
         cat_name:[
           { required: true, message: '请输入活动名称', trigger: 'blur' }
         ]
       },
       editId:0

     }
   },
   created(){
        this.getCategories()
   },
   methods:{
      async getCategories(){
         const {data:res}=await this.$http.get(`categories`,{params:this.queryInfo})
           if(res.meta.status!==200){
             return 
           }
           console.log(res);
           this.total=res.data.total
           this.cateList=res.data.result
           console.log(this.cateList);
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getCategories()
      },
      handleCurrentChange(newNum){
        this.queryInfo.pagenum=newNum;
        this.getCategories()
      },
      addCateVisible(){
        this.ShowAddCateDialogVisible=true
      },
      handleChange(){
        console.log(this.cascaderSelectValue);
          if(this.cascaderSelectValue.length>0){
                this.addForm.cat_pid=this.cascaderSelectValue[this.cascaderSelectValue.length-1]
                this.addForm.cat_level=this.cascaderSelectValue.length
                return
          }else{
             this.cat_pid=0;
             this.cat_level=0;
          }
      },
      async commitCategories(){
        const{data:res}=await this.$http.post('categories',this.addForm)
        if(res.meta.status!==201){
          return this.$message.error('添加商品分类失败!')
        }
         this.$message.success('添加商品分类成功!')
         this.ShowAddCateDialogVisible=false
         this.getCategories()
      },
      async removeCategoriesById(row){
          const confirmType=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmType!=='confirm'){
          return
        }
        const{data:res}=await this.$http.delete(`categories/${row.cat_id}`)
             if(res.meta.status!==200){
               return  this,$message.error('删除分类数据失败!')
             }
             this.$message.success('删除分类商品成功!')
             this.getCategories()
      },
      showEditDialogVisible(row){
        this.editForm.cat_name=row.cat_name
        this.editId=row.cat_id
        this.editCateDialogVisible=true
      },
      async commitEditCateInfo(){
          const{data:res}=await this.$http.put(`categories/${this.editId}`,this.editForm)
          console.log(res);
             if(res.meta.status!==200){
               return this.$message.error('编辑分类信息失败!')
             }
             this.$message.success('编辑分类信息成功')
             this.getCategories()
             this.editCateDialogVisible=false;

      }
   }
}
</script>

<style lang='less' scoped>
.el-icon-success{
  color: greenyellow;
}
.el-icon-error{
  color: red;
}
.addBtn{
  margin-bottom:10px;
}
.el-cascader{
  width: 100%;
}
</style>