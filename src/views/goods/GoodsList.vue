<template>
   <div>
       <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-row :gutter="20">
            <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" @clear='clearSearchInp'  clearable>
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="goodsAdd">添加用户</el-button>
        </el-col>
    </el-row>
    <el-table :data="goods" border stripe> 
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name">
        </el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="100"></el-table-column>
        <el-table-column label="商品重量(kg)" prop="goods_weight" width="80"></el-table-column>
        <el-table-column label="商品创建时间"  width="120">
            <template #default='scope'>
                {{scope.row.add_time|dataFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
           <template #default='scope'>
             <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.goods_id)"></el-button>
           </template>
        </el-table-column>
    </el-table>
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
   </div>
</template>

<script>
export default {
    name:"GoodsList",
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            goods:[]
        }
    },
    created(){
         this.getGoodsList()
    },
    methods:{
        async getGoodsList(){
           const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取商品列表失败')
            }
            this.total=res.data.total
            this.goods=res.data.goods
           console.log(this.goods);
       },
       handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getGoodsList()
       },
       handleCurrentChange(newNum){ 
          this.queryInfo.pagenum=newNum
          this.getGoodsList()
       },
       clearSearchInp(){
           this.getGoodsList()
       },
       goodsAdd(){
           this.$router.push('/goods/add')
       },
       async deleteGood(id){
        const confirmType=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
          if(confirmType==='confirm'){
          const {data:res}=await this.$http.delete(`goods/${id}`)
             if(res.meta.status!==200){
                 return this.$message.error('删除商品失败!')
             }
             this.$message.success('删除商品成功!')
             this.getGoodsList()
          }
       }
    }
}
</script>

<style lang='less' scoped>

</style>