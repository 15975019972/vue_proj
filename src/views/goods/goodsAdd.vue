<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>添加商品</el-breadcrumb-item>
     </el-breadcrumb>
     <el-card>
         <el-row>
             <el-col>
            <el-alert
               title="消息提示的文案"
               type="info"
               show-icon
               center>
             </el-alert>
             </el-col>
         </el-row>
         <el-row>
             <el-col>
              <el-steps :space="200" :active="active" finish-status="success" align-center>
                 <el-step title="基本信息"></el-step>
                 <el-step title="商品参数"></el-step>
                 <el-step title="商品属性"></el-step>
                 <el-step title="商品图片"></el-step>
                 <el-step title="商品内容"></el-step>
                 <el-step title="完成"></el-step>
               </el-steps>
             </el-col>
         </el-row>
         <el-form :model="goodsForm"  ref="goodsFormRef" :rules="goodsFormRules" label-width="100px"  label-position='top'>
         <el-tabs tab-position="left"  @tab-click='tab_c' :stretch='true' :before-leave='active_tab' ref='tabsRef'>
         <el-tab-pane label="商品名称">
            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_number">
                  <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
          <el-form-item label="商品数量" prop="goods_weight">
                <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
          </el-form-item>
             <el-cascader
                v-model="select_value"
                :options="cateList"
                :props="props"
                @change="selectCascaderhandleChange">
              </el-cascader>
            </el-tab-pane>
            <el-tab-pane label="商品参数">
                <el-form-item v-for="item in manyCategoriesList" :key="item.attr_id" :label="item.attr_name">
                      <el-checkbox v-for="(it1,idx) in item.attr_vals" :key="idx" border checked @change="checkBoxRemove(idx)">{{it1}}</el-checkbox>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
      <el-form  label-width="100px"  label-position='top'>
        <el-form-item :label="item.attr_name" v-for="item in onlyCategoriesList" :key="item.id">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
              <!-- action表示的是 文件上传的路径的api地址 -->
          <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers='headerObj'
            :on-success='handleSuccess'>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
           <quill-editor
               v-model="goodsForm.goods_introduce"
               ref="myQuillEditor"
               >
           </quill-editor>
           <el-button type="success" class="loadToServe" @click="loadToServe">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
          </el-form>
     </el-card>
     <el-dialog
  title="提示"
  :visible.sync="ShowImgdialogVisible"
  width="50%">
  <img :src="pirView" alt="" class="pirViewImg">
</el-dialog>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill';
export default {
     name:"goodsAdd",
     components:{
        quillEditor
     },
     data(){
         return{
             active:0,
            //  级联数据
             cateList:[],
            //  级联选择器value
            select_value:[],
             props:{
               label:'cat_name',
               value:'cat_id',
               children:'children',
               expandTrigger: 'hover'
             },
             goodsForm:{
                 goods_name:'',
                 goods_price:999,
                 goods_number:1,
                 goods_weight:1,
                 goods_cat:'',
                //  图片的数组
                 pics:[],
                 goods_introduce:'',
                 goods_cat:'',
                 attrs:[]
             },
             goodsFormRules:{
                 goods_name:[
                     { required: true, message: '请输入活动名称', trigger: 'blur' },
                 ],
                 goods_price:[
                    { required: true, message: '请输入价格 ', trigger: 'blur' }
                 ],
                 goods_number:[
                   { required: true, message: '请输入重量 ', trigger: 'blur' }
                 ],
                 goods_weight:[
                   { required: true, message: '请输入数量 ', trigger: 'blur' }
                 ]
             },
            //  动态参数参数列表
            manyCategoriesList:[],
            // 静态参数列表
            onlyCategoriesList:[],
            // 图片上传的路径
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj:{
              Authorization:window.sessionStorage.getItem('token')
            },
            pirView:'',
            ShowImgdialogVisible:false
            
         }
     },
     created(){
      this.getCateList()
     },
     methods:{
         tab_c(e){
             if(this.select_value.length!==3){
               return this.active=parseInt(0)
             }
             this.active=parseInt(e.paneName)
            //  console.log(e.paneName);
         },
         async getCateList(){
            const {data:res}=await this.$http.get('categories')
               if(res.meta.status!==200){
                  return this.$message.error('获取商品分类失败!')
               }
              this.cateList=res.data
              // console.log(this.cateList);
         },
         selectCascaderhandleChange(){
           console.log(this.select_value);
         },
        // 监听tabs的 活跃和 不活跃状态
         active_tab(activeName,oldActive){
              if(oldActive==='0'&&this.select_value.length!==3){
                   this.$message.info('请选择分类商品名称！')
                return false
              }
              if(activeName==='1'){
                return this.getManyCategoriesList()
              }else if(activeName==='2'){
                   this.getOnlyCategoriesList()
              }
               
         },
        //  请求参数列表
        async getManyCategoriesList(){
           const id=this.select_value[this.select_value.length-1]
            const{data:res}=await this.$http.get(`categories/${id}/attributes`,{params:{sel:'many'}})
             if(res.meta.status!==200){
               return thi.$message.error('获取参数数据列表失败!')
             }
             console.log(res.data[0].attr_vals);
             res.data[0].attr_vals=res.data[0].attr_vals.split(' ')
             this.manyCategoriesList=res.data
            //  console.log(this.categoriesList);
        },
        async getOnlyCategoriesList(){
          const id=this.select_value[this.select_value.length-1]
         const{data:res}=await this.$http.get(`categories/${id}/attributes`,{params:{sel:'only'}})
          if(res.meta.status!==200){
            return thi.$message.error('获取参数数据列表失败!')
          }
          // console.log(res);
          this.onlyCategoriesList=res.data
          console.log( this.onlyCategoriesList);
        },
         
        // 移除复选框的参数
        checkBoxRemove(index){
          // console.log('1');
           this.manyCategoriesList[0].attr_vals.splice(index,1)
        },
        // 处理图片预览效果
        handlePreview(file){
          this.pirView=file.response.data.url
          this.ShowImgdialogVisible=true
        },
        // 移除图片处理的函数
        handleRemove(file){
          
              const filePath=file.response.data.tmp_path
              const index=this.goodsForm.pics.findIndex(item=>item.pic===filePath)
              this.goodsForm.pics.splice(index,1)
            //  console.log(file);
        },
        // 监听图片上传成功的路径 
        handleSuccess(res){
          const tem_path={
            pic:res.data.tmp_path
          }
            this.goodsForm.pics.push(tem_path)
        },
        loadToServe(){
            this.$refs.goodsFormRef.validate(async valid=>{
                if(!valid){
                  return this.$message.error('请输入完整的商品信息!')
                }
                this.goodsForm.goods_cat=this.cateList.join(',')
               console.log(this.goodsForm.goods_cat);
                // 静态或动态属性参数
                const arr=[
                  ...this.manyCategoriesList,
                  ...this.onlyCategoriesList
                ]
                this.goodsForm.attrs=arr;

                 const{data:res}=await this.$http.post('goods',this.goodsForm)
                 if(res.meta.status!==201){
                   return this.$message.error(res.meta.msg)
                 }
                 this.$message.success('创建商品成功!')
                 this.$router.push('/goods')
                 console.log(res);
            })
        }
     }

}
</script>

<style lang='less' scoped>
.el-steps{
    margin: 20px 0;
}
.el-checkbox{
  margin-right: 5px !important;
}
.pirViewImg{
  width: 100%;
}
.loadToServe{
  margin: 10px 0;
}
</style>