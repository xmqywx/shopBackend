<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="username" clearable placeholder="输入客户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-date-picker
        class="filter-item"
        v-model="startTime"
        type="date"
        placeholder="开始日期"
        value-format="yyyy-MM-dd"
        style="width: 180px">
      </el-date-picker>
      <el-date-picker
        class="filter-item"
        v-model="endTime"
        type="date"
        placeholder="结束日期"
        value-format="yyyy-MM-dd"
        style="width: 180px">
      </el-date-picker>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>

      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>

    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
<!--      <el-table-column type="selection" width="55" />-->
<!--      <el-table-column prop="id" label="id" />-->
<!--      <el-table-column prop="uid" label="用户ID" />-->
<!--      <el-table-column  prop="userName" label="用户名" />-->
<!--      <el-table-column prop="productId" label="商品ID" />-->
      <el-table-column prop="userName" label="客户名称" />
      <el-table-column prop="product.ertId" label="商品编号" />
      <el-table-column prop="product.storeName" label="商品名称" />
      <el-table-column prop="product.erpGoodsspec" label="商品规格" />
      <el-table-column prop="product.erpManufacturer" label="生产厂家" />
      <el-table-column prop="product.erpUnit" label="包装单位" />
      <el-table-column prop="product.storeCategory.cateName" label="商品分类" />
      <el-table-column ref="table" prop="product.image" label="商品图片">
        <template slot-scope="scope">
          <a :href="scope.row.product.image" style="color: #42b983" target="_blank"><img :src="scope.row.product.image" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.type == 'collect'" :type="''">收藏</el-tag>
            <el-tag v-else :type=" 'info' ">足迹</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from '@/mixins/crud'
export default {
  name: 'YxStoreProductRelation',
  mixins: [initData],
  data(){
    return {
      query:{
        type: 'type',
      },
      startTime: '',
      endTime: '',
      username:''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/yxStoreProductRelation'
      const sort = 'create_time,desc'
      this.params = { page: this.page, size: this.size, sort: sort,username: this.username,startTime:this.startTime, endTime:this.endTime}
      const query = this.query
      this.params[query.type] = 'collect'
      return true
    }
  }
}
</script>

<style scoped>

</style>
