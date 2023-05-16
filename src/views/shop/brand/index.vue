<template>
  <div class="app-container">
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.brandName" clearable size="small" placeholder="输入品牌名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <rrOperation :crud="crud" />
        </div>
        <crudOperation :permission="permission" />
      </div>


      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
<!--          <el-form-item label="ID">-->
<!--            <el-input v-model="form.id" style="width: 370px;" />-->
<!--          </el-form-item>-->
          <el-form-item label="品牌名称" prop="brandName">
            <el-input v-model="form.brandName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌图片">
<!--            <el-input v-model="form.image" style="width: 370px;" />-->
            <single-pic v-model="form.image"  type="image" :num="1" :width="150" :height="150" />

          </el-form-item>
          <el-form-item label="品牌助记码">
            <el-input v-model="form.logogram" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌排序" prop="brandSort">
            <el-input v-model="form.brandSort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.isShow" style="width: 178px">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
<!--          <el-form-item label="添加时间">-->
<!--            <el-input v-model="form.createTime" style="width: 370px;" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="更新时间">-->
<!--            <el-input v-model="form.updateTime" style="width: 370px;" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="是否删除" prop="isDel">-->
<!--            <el-input v-model="form.isDel" style="width: 370px;" />-->
<!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" row-key="id" @selection-change="crud.selectionChangeHandler">
        <el-table-column :selectable="checkboxT" type="selection" width="55" />
<!--        <el-table-column type="selection" width="55" />-->
<!--        <el-table-column v-if="columns.visible('id')" prop="id" label="ID" />-->
        <el-table-column v-if="columns.visible('brandName')" prop="brandName" label="品牌名称" />
        <el-table-column v-if="columns.visible('image')" prop="image" label="品牌图片" >
          <template slot-scope="scope">
            <a :href="scope.row.image" style="color: #42b983" target="_blank">
              <img :src="scope.row.image" alt="点击打开" style="max-height: 40px" />
            </a>
          </template>
        </el-table-column>>
        <el-table-column v-if="columns.visible('logogram')" prop="logogram" label="品牌助记码" />
<!--        <el-table-column v-if="columns.visible('brandSort')" prop="brandSort" label="品牌排序" />-->
        <el-table-column v-if="columns.visible('isShow')" label="状态" align="center" prop="isShow">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isShow === 1" :type="''">显示</el-tag>
              <el-tag v-else :type=" 'info' ">隐藏</el-tag>
            </div>
          </template>
        </el-table-column>
<!--        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="添加时间">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{ parseTime(scope.row.createTime) }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{ parseTime(scope.row.updateTime) }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column v-if="columns.visible('isDel')" prop="isDel" label="是否删除" />-->
        <el-table-column v-permission="['admin','yxBrand:edit','yxBrand:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
</template>

<script>
import crudYxBrand from '@/api/yxBrand'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";
import singlePic from '@/components/singlematerial'
// crud交由presenter持有
const defaultCrud = CRUD({image: null,  url: 'api/yxBrand', crudMethod: { ...crudYxBrand }})
const defaultForm = { id: null, brandName: null, image: '', logogram: null, createTime: null, updateTime: null, isDel: 0,isShow: 1 }
export default {
  name: 'Brand',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList, singlePic},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'YXBRAND_CREATE'],
        edit: ['admin', 'YXBRAND_EDIT'],
        del: ['admin', 'YXBRAND_DELETE']
      },
      rules: {
        brandName: [
          { required: true, message: '品牌名称不能为空', trigger: 'blur' }
        ],
        brandSort: [
          { required: true, message: '品牌排序不能为空', trigger: 'blur' }
        ],
        isDel: [
          { required: true, message: '是否删除不能为空', trigger: 'blur' }
        ]
      }    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}



</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
