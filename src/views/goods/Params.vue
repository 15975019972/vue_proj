<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>商品列表</el-breadcrumb-item>
     </el-breadcrumb>
     <el-card>
     <el-alert
       title="警告提示的文案"
       type="warning"
       show-icon>
     </el-alert>
  <el-cascader
    v-model="selectCateValue"
    :options="categoriesList"
    :props="cateProps"
    @change="handleChange">
  </el-cascader>
  <el-tabs v-model="activeName" @tab-click="handleClick">
   <el-tab-pane label="动态数据" name="many">
      <el-button type="primary" :disabled='selectCateValue.length!==3' size="mini" @click="showAddDialogVisible">添加参数</el-button>
       <el-table :data="showCateList" border stripe>
     <el-table-column  type="expand">
        <template #default='scope'>
            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close='removeParamsById(scope.row,index)'>{{item}}</el-tag>
      <el-input
      class="input-new-tag"
      v-model="scope.row.inputValue"
      ref="saveTagInput"
      placeholder="请输入内容"
      v-if="scope.row.inputVisible"
      @keyup.enter.native="handleInputConfirm(scope.row)"
      @blur="handleInputConfirm(scope.row)"
      ></el-input>
       <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
     </el-table-column>
     <el-table-column type="index" label="#"></el-table-column>
     <el-table-column label="参数名称" prop="attr_name"></el-table-column>
     <el-table-column label="操作" width="200">
       <template #default='scope'>
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParamsById(scope.row)"></el-button>
       </template>
     </el-table-column>
    </el-table>
  </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
  <el-button type="primary" :disabled='selectCateValue.length!==3' size="mini" @click="showAddDialogVisible">添加参数</el-button>
       <el-table :data="showCateList" border stripe>
     <el-table-column  type="expand">
        <template #default='scope'>
            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close='removeParamsById(scope.row,index)'>{{item}}</el-tag>
      <el-input
      class="input-new-tag"
      v-model="scope.row.inputValue"
      ref="saveTagInput"
      placeholder="请输入内容"
      v-if="scope.row.inputVisible"
      @keyup.enter.native="handleInputConfirm(scope.row)"
      @blur="handleInputConfirm(scope.row)"
      ></el-input>
       <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
     </el-table-column>
     <el-table-column type="index" label="#"></el-table-column>
     <el-table-column label="参数名称" prop="attr_name"></el-table-column>
     <el-table-column label="操作" width="200">
       <template #default='scope'>
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParamsById(scope.row)"></el-button>
       </template>
     </el-table-column>
    </el-table>
   </el-tab-pane>
  </el-tabs>
     </el-card>
<el-dialog
  title="提示"
  :visible.sync="addDialogVisible"
  width="50%">
  <el-form :model="addCateForm" :rules="addCaterRules" ref="addCateFormRef" label-width="100px">
  <el-form-item :label="activeName==='only'?'静态参数':'动态参数'" prop="attr_name">
    <el-input v-model="addCateForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitCateReslt">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name:"Params",
  data(){
    return{
      categoriesList:[],
      selectCateValue:[],
      cateProps:{
        label:"cat_name",
        value:"cat_id",
        children:'children',
       expandTrigger: 'hover'
      },
      activeName:'many',
      addDialogVisible:false,
      addCateForm:{
        attr_name:''
      },
      addCaterRules:{
         attr_name:[
           { required: true, message: '请输入参数名称', trigger: 'blur' }
         ]
      },
      showCateList:[]
    }
  },
  created(){
    this.geitCateList()
  },
  methods:{
     async geitCateList(){  
       const {data:res}=await this.$http.get('categories')
         if(res.meta.status!==200){
           return  this.$message.error('获取商品分类失败!')
         }
         this.categoriesList=res.data
     },
     async handleChange(){
        const {data:res}=await this.$http.get(`categories/${this.selectId}/attributes`,{params:{sel:this.activeName}})
          if(res.meta.status!==200){
            return this.$message.error('获取参数列表失败!')
          }
           res.data.forEach(item=>{
             item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
             item.inputVisible=false
             item.inputValue=''
           })
          this.showCateList=res.data
          console.log(this.showCateList);
     },
     handleClick(){
        if(this.selectCateValue.length!==3){
          return
        }
         this.handleChange()
     },
     showAddDialogVisible(){
       this.addDialogVisible=true
     },
     async commitCateReslt(){
        const{data:res}=await this.$http.post(`categories/${this.selectId}/attributes`,{
          'attr_name':this.addCateForm.attr_name,
          'attr_sel':this.activeName
        })
        if(res.meta.status!==201){
          return this.$message.error('添加参数或者属性失败!')
        }
        this.handleChange()
        this.addDialogVisible=false
     },
     showInput(row){
        row.inputVisible=true
         this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
     },
     async saveArr(row){
       const {data:res}=await this.$http.put(`categories/${this.selectId}/attributes/${row.attr_id}`,{
          "attr_name":row.attr_name,
          'attr_sel':row.attr_sel,
          'attr_vals':row.attr_vals.join(' ')
       })
     },
    //  表单失去焦点 按下空格的时候
     handleInputConfirm(row){
          if(row.inputValue.trim().length===0){
            return row.inputVisible=false
          }
          row.attr_vals.push(row.inputValue.trim())
          this.saveArr(row)
          row.inputValue=''
       row.inputVisible=false
     },
     removeParamsById(row,index){
        row.attr_vals.splice(index,1)
        this.saveArr(row)
     },
    //  删除  静态/动态属性
    async deleteParamsById(row){
      const confirmType=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
          if(confirmType!=='confirm'){
            return
          }
       const{data:res}=await this.$http.delete(`categories/${this.selectId}/attributes/${row.attr_id}`)
           if(res.meta.status!==200){
             return this.$message.error('删除参数失败!')
           }
           this.$message.success('删除参数成功!')
           this.handleChange()
          
     }
  },
  computed:{
     selectId(){
       return this.selectCateValue[this.selectCateValue.length-1]
     }
  }
}
</script>

<style lang='less'>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-input__inner{
    height: 32px !important;
    line-height: 32px !important;
    font-size: 12px;
  }
</style>