<template>
  <div>
    <div v-if="value.productId">
      <ul  class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-ready">
          <div>
            <img :src="value.image" alt="" class="el-upload-list__item-thumbnail">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete" @click="deleteGood">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else tabindex="0" class="el-upload el-upload--picture-card"  @click="toSelete">
      <i class="el-icon-plus" />
    </div>
    <el-dialog :visible.sync="dialog" append-to-body width="60%" title="商品列表">
      <div class="app-container">
      <!--工具栏-->
      <div class="head-container">
        <!-- 搜索 -->
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />

        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <!-- 新增 -->

      </div>
    <!--表单组件-->

    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" >
      <!-- <el-table-column prop="id" label="商品id" /> -->
      <el-table-column ref="table" prop="image" label="商品图片">
        <template slot-scope="scope">
          <a :href="scope.row.image" style="color: #42b983" target="_blank"><img :src="scope.row.image" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="storeName" label="商品名称" />
      <el-table-column prop="erpGoodsspec" label="商品规格/单位">
        <template slot-scope="scope">
          {{ scope.row.erpGoodsspec + " / " + scope.row.erpUnit }}
        </template>
      </el-table-column>
      <el-table-column prop="erpManufacturer" label="商品厂家" />
      <!-- <el-table-column prop="erpUnit" label="商品单位" /> -->
      <el-table-column width="80" prop="erpQty" label="件包装" />
      <!-- <el-table-column prop="erpMidpack" label="中包装" /> -->
      <!-- <el-table-column prop="erpFormula" label="剂型" /> -->
      <el-table-column width="80" prop="erpPlancate" label="规划分类" />
      <el-table-column prop="storeCategory.cateName" label="商品分类" />
      <el-table-column width="80" prop="stock" label="库存" />

      <el-table-column prop="stock" label="价格">
        <template slot-scope="scope">
          <div type="success" v-if="scope.row.aprice > 0">
            调拨: {{ scope.row.aprice }}
          </div>
          <div type="success" v-if="scope.row.bprice > 0">
            民营: {{ scope.row.bprice }}
          </div>
          <div type="success" v-if="scope.row.cprice > 0">
            医院: {{ scope.row.cprice }}
          </div>
          <div type="success" v-if="scope.row.dprice > 0">
            终端: {{ scope.row.dprice }}
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="185" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="doSelect(scope.row)"
          >选择</el-button>
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
  </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
export default {
  components: { },
  mixins: [initData],
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      delLoading: false,
      dialog: false,
      queryTypeOptions: [
        { key: "storeName", display_name: "商品名称" },
        { key: "erpManufacturer", display_name: "商品厂家" },
        { key: "erpRelId", display_name: "商品编号" },
        { key: "erpLogogram", display_name: "商品助记码" }
      ],
      isAttr: false,
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/yxStoreProduct'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort, isShow: 1, isDel: 0 ,isIntegral:0}
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    deleteGood() {
      const that = this
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        that.$set(that.value,"productId", null)
        that.$set(that.value,"storeName", null)
        that.$set(that.value,"image", null)
        that.$set(that.value,"otPrice", null)
        that.$set(that.value,"price", null)
        that.$set(that.value,"cform",null)
      })
    },
    doSelect(data) {
      this.$set(this.value,"productId", data.id)
      this.$set(this.value,"storeName", data.storeName)
      this.$set(this.value,"image", data.image)
      this.$set(this.value,"otPrice", data.otPrice)
      this.$set(this.value,"price", data.price)
      this.$set(this.value,"cform",data)
      this.dialog = false
    },
    toSelete() {
      this.dialog = true
    }

  }
}
</script>

<style scoped>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
