<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <el-select
        v-model="query.type"
        clearable
        placeholder="搜索类型"
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
        v-model="cateId"
        clearable
        placeholder="商品分类"
        class="filter-item"
        filterable
        :filter-method="dataFilter"
        style="width: 130px"
      >
        <el-option
          v-for="item in optionsMetaShow"
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
      <div style="display: inline-block;margin: 0px 2px;">
        <!-- <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="toAddURL"
        >
            新增
        </el-button> -->
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
          icon="el-icon-minus"
          @click="piliangXia"
          >批量下架</el-button
        >
      </div>
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
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :data="data"
      size="small"
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
      <el-table-column prop="erpGoodsspec" label="商品规格">
        <template slot-scope="scope">
          {{ scope.row.erpGoodsspec }}
        </template>
      </el-table-column>
      <el-table-column prop="erpManufacturer" label="生产厂家" />
      <!-- <el-table-column prop="erpUnit" label="商品单位" /> -->


      <el-table-column width="80" prop="erpUnit" label="单位" />
      <el-table-column width="80" prop="erpMidpack" label="中包装" />
      <el-table-column width="80" prop="erpQty" label="件包装" />
       <el-table-column width="80" prop="erpFormula" label="剂型" />
      <el-table-column width="80" prop="erpPlancate" label="规划分类" />
      <el-table-column width="80" prop="erpGcategory" label="商品类别" />
      <el-table-column width="80" prop="erpQcategory" label="质量类别" />
      <el-table-column width="80" prop="brandName" label="商品品牌" />

      <el-table-column
        width="80"
        prop="storeCategory.cateName"
        label="商品分类"
      />
      <!-- <el-table-column prop="sales" label="销量" /> -->
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

      <el-table-column fixed="right" label="操作" width="265px" align="center">
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
            icon="el-icon-remove"
            @click="onSale(scope.row.id, true)"
          >
          </el-button>
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
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Treeselect from "@riophae/vue-treeselect";
export default {
  components: { Treeselect },
  mixins: [initData],
  data() {
    return {
      dropDownValue: "",
      optionsMetaShow: [],
      delLoading: false,
      visible: false,
      query: {
        type: '',
        value: ''
      },
      queryTypeOptions: [
        { key: "storeName", display_name: "商品名称" },
        { key: "erpManufacturer", display_name: "商品厂家" },
        { key: "ertId", display_name: "商品编号" },
        { key: "erpLogogram", display_name: "商品助记码" }
      ],
      isAttr: false,
      cateId: null,
      multipleSelection: []
    };
  },
  created() {
    this.query.type = this.$route.query.type;
    this.query.value = this.$route.query.value;
    this.cateId = this.$route.query.cateId;
    this.page = Number(this.$route.query.page || this.page);
    this.size = Number(this.$route.query.size || this.size);
    this.$nextTick(() => {
      this.init().then(() => {
        this.optionsMetaShow = this.cateList;
      });
    });
  },
  methods: {
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
    toAddURL() {
      this.$router.push({ path: "/shop/goodsAdd" });
    },
    toUpdateURL(id) {
      this.$router.push({
        path: "/shop/goodsEdit/" + id,
        query: {
          page: this.page,
          size: this.size,
          type: this.query.type,
          value: this.query.value,
          cateId: this.cateId,
          isShow: 1
        }
      });
    },
    dataFilter(val) {
      this.value = val;
      if (val) {
        this.optionsMetaShow = this.cateList.filter(item => {
          if (
            !!~item.label.indexOf(val) ||
            !!~item.label.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          }
        });
      } else {
        this.optionsMetaShow = this.cateList;
      }
    },
    checkPermission,
    beforeInit() {
      this.url = "api/yxStoreProduct";
      const sort = "id,desc";
      this.params = {
        page: this.page,
        size: this.size,
        sort: sort,
        isShow: 1,
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
    piliangXia() {
      const idArr = this.multipleSelection.map(item => item.id);
      this.$confirm(`确定进行批量下架操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          onsales(idArr.join(","), { status: true }).then(({ data }) => {
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
    },
    attr(data) {
      this.isAttr = false;
      const _this = this.$refs.form2;
      _this.form = {
        id: data.id,
        merId: data.merId,
        image: data.image,
        sliderImage: data.sliderImage,
        storeName: data.storeName,
        storeInfo: data.storeInfo,
        keyword: data.keyword,
        barCode: data.barCode,
        storeCategory: data.storeCategory,
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
      this.$refs.form2.getAttrs(data.id);
    }
  }
};
</script>

<style scoped></style>
