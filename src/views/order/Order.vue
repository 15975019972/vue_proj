<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>订单管理</el-breadcrumb-item>
     <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
     <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
           <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @close='getOrderList'>
         <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data='orderList' border stripe>
         <el-table-column type="index" label="#"></el-table-column>
         <el-table-column prop="order_number" label="订单编号" width="250"></el-table-column>
         <el-table-column prop="order_price" label="订单价格"></el-table-column>
         <el-table-column prop="is_send" label="是否发货"></el-table-column>
         <el-table-column prop="order_pay" label="是否付款">
            <template #default='scope'>
              <el-tag v-if="scope.row.order_pay==='0'" type="danger">未付款</el-tag>
              <el-tag  type="success" v-else>已付款</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="下单时间">
           <template #default='scope'>
             {{scope.row.create_time|dataFormat}}
           </template>
         </el-table-column>
         <el-table-column label='操作'>
           <template #default='scope'>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="addKuaiDialogVisible"></el-button>
                <el-button type="success" icon="el-icon-location" size="mini" @click="showKuaidiInofDialogVisible"></el-button>
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
    <el-dialog
      title="提示"
      :visible.sync="editkuadiDialogVisible"
      width="50%" @close='addressDialogVisible'>
  <el-form :model="kuaiForm" :rules="kuaiRules" ref="kuaiDiRef" label-width="100px" class="demo-ruleForm">
    <el-form-item label="活动名称" prop="address1">
    <el-input v-model="kuaiForm.address1"></el-input>
  </el-form-item>
  <el-form-item label="省市区/县">
     <el-cascader
    v-model="kuaiForm.address2"
    :options="cityData"
    :props="{ expandTrigger: 'hover'}"
    @change="handleChange"
     style="width:100%">
    </el-cascader>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editkuadiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editkuadiDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
   </el-card>
   <!-- 快递信息dialog -->
   <el-dialog
  title="提示"
  :visible.sync="kuadiInfoDialogVisible"
  width="50%"
  >
  <el-timeline :reverse="false">
    <el-timeline-item
      v-for="(activity, index) in kuaiInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="kuadiInfoDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="kuaidInfoDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
   name:'Order',
   data(){
     return{
        orderList:[],
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        total:0,
        editkuadiDialogVisible:false,
        kuaiForm:{
           address1:'',
           address2:[]
        },
        kuaiRules:{
          address1:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
          address2:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ]
        },
        cityData,
        kuadiInfoDialogVisible:false,
        kuaiInfo:[]
     }
   },
   created(){
     this.getOrderList()
   },
   methods:{
       async getOrderList(){
          const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status!==200){
              return this.$message.error('获取订单数据失败!')
            }
            this.orderList=res.data.goods
            this.total=res.data.total
             console.log(this.orderList);
       },
       handleSizeChange(newSize){
          this.queryInfo.pagesize=newSize
          this.getOrderList()
       },
       handleCurrentChange(newNum){
           this.queryInfo.pagenum=newNum;
           this.getOrderList()
       },
       addKuaiDialogVisible(){
         this.editkuadiDialogVisible=true
       },
       handleChange(){
         console.log(this.kuaiForm.address2);
       },
       addressDialogVisible(){
         this.$refs.kuaiDiRef.resetFields()
       },
       async showKuaidiInofDialogVisible(){
         const {data:res}=await this.$http.get(`kuaidi/804909574412544580`)
          if(res.meta.status!==200){
            return
          }
          this.kuaiInfo=res.data
          console.log(this.kuaiInfo);
         this.kuadiInfoDialogVisible=true
       }
   }
}
</script>

<style lang='less' scoped>
</style>