<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.type"
        clearable
        placeholder="类型"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in queryTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="cateId"
        clearable
        placeholder="商品分类"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in cateList"
          :disabled="item.disabled === 0"
          :value="item.value"
          :key="item.id"
          :label="item.label"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
        >搜索</el-button
      >
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
        >刷新</el-button
      >
      <el-button
        type="warning"
        class="filter-item"
        :disabled="!multipleSelection.length"
        size="mini"
        icon="el-icon-upload2"
        @click="piliangXia"
        >批量上架</el-button
      >
    </div>
    <!--表单组件-->
    <!--表格渲染-->
    <!-- <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    /> -->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" />

      <!-- <el-table-column prop="erpRelId" label="商品id" /> -->
      <el-table-column width="80" ref="table" prop="image" label="商品图片">
        <template slot-scope="scope">
          <a :href="scope.row.image" style="color: #42b983" target="_blank"
            ><img :src="scope.row.image" alt="点击打开" class="el-avatar"
          /></a>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="ertId" label="商品编号" />

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
      <el-table-column
        width="80"
        prop="storeCategory.cateName"
        label="商品分类"
      />

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
      <el-table-column prop="erpApprovalno" label="批准文号" />

      <el-table-column
        fixed="right"
        v-if="
          checkPermission([
            'admin',
            'YXSTOREPRODUCT_ALL',
            'YXSTOREPRODUCT_EDIT',
            'YXSTOREPRODUCT_DELETE'
          ])
        "
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="toUpdateURL(scope.row.id)"
          >
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-circle-plus"
            @click="onSale(scope.row.id, false)"
          >
          </el-button>
          <!-- <el-popover
            :ref="scope.row.id"
            v-permission="['admin','YXSTOREPRODUCT_ALL','YXSTOREPRODUCT_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover> -->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/crud";
import { del, onsale, onsales } from "@/api/yxStoreProduct";
import eForm from "./form";
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      visible: false,
      cateId: null,
      query: {
        type: '',
        value: ''
      },
      multipleSelection: [],
      queryTypeOptions: [
        { key: "storeName", display_name: "商品名称" },
        { key: "erpManufacturer", display_name: "商品厂家" },
        { key: "ertId", display_name: "商品编号" },
        { key: "erpLogogram", display_name: "商品助记码" }
      ]
    };
  },
  created() {
    this.$nextTick(() => {

      this.query.type = this.$route.query.type || null;

      this.query.value = this.$route.query.value || '';
      this.cateId = this.$route.query.cateId;
      this.page = Number(this.$route.query.page || this.page);
      this.size = Number(this.$route.query.size || this.size);
      this.init();
    });
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = "api/yxStoreProduct";
      const sort = "id,desc";
      this.params = {
        page: this.page,
        size: this.size,
        sort: sort,
        isShow: 0,
        isDel: 0,
        cateId: this.cateId
      };
      const query = this.query;
      const type = query.type;
      const value = query.value;
      if (type && value) {
        this.params[type] = value;
      }
      return true;
    },
    toUpdateURL(id) {
      this.$router.push({
        path: `/shop/goodsEdit/${id}`,
        query: {
          page: this.page,
          size: this.size,
          type: this.query.type,
          value: this.query.value,
          cateId: this.cateId,
          isShow: 0
        }
      });
    },
    subDelete(id) {
      this.delLoading = true;
      del(id)
        .then(res => {
          this.delLoading = false;
          this.$refs[id].doClose();
          this.dleChangePage();
          this.init();
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          this.delLoading = false;
          this.$refs[id].doClose();
          console.log(err.response.data.message);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    piliangXia() {
      const idArr = this.multipleSelection.map(item => item.id);
      this.$confirm(`确定进行批量上架操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          onsales(idArr.join(","), { status: false }).then(({ data }) => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.init();
              }
            });
          });
        })
        .catch(() => {});
    },
    onSale(id, status) {
      this.$confirm(`确定进行[${status ? "下架" : "上架"}]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          onsale(id, { status: status }).then(({ data }) => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.init();
              }
            });
          });
        })
        .catch(() => {});
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
      this.$refs.form.getCates();
    },
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      _this.getCates();
      _this.form = {
        id: data.id,
        merId: data.merId,
        image: data.image,
        sliderImage: data.sliderImage,
        imageArr: data.image.split(","),
        sliderImageArr: data.sliderImage.split(","),
        storeName: data.storeName,
        storeInfo: data.storeInfo,
        keyword: data.keyword,
        barCode: data.barCode,
        storeCategory: data.storeCategory || { id: null },
        price: data.price,
        vipPrice: data.vipPrice,
        otPrice: data.otPrice,
        postage: data.postage,
        unitName: data.unitName,
        sort: data.sort,
        sales: data.sales,
        stock: data.stock,
        isShow: data.isShow,
        isHot: data.isHot,
        isBenefit: data.isBenefit,
        isBest: data.isBest,
        isNew: data.isNew,
        description: data.description,
        addTime: data.addTime,
        isPostage: data.isPostage,
        isDel: data.isDel,
        merUse: data.merUse,
        giveIntegral: data.giveIntegral,
        cost: data.cost,
        isSeckill: data.isSeckill,
        isBargain: data.isBargain,
        isGood: data.isGood,
        ficti: data.ficti,
        browse: data.browse,
        codePath: data.codePath,
        soureLink: data.soureLink
      };
      _this.dialog = true;
    }
  }
};
</script>

<style scoped></style>
