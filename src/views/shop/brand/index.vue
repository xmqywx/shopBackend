<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌名称" prop="brandName">
            <el-input v-model="form.brandName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌图片">
            <el-input v-model="form.image" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌助记码">
            <el-input v-model="form.logogram" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌排序" prop="brandSort">
            <el-input v-model="form.brandSort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否删除" prop="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="ID" />
        <el-table-column v-if="columns.visible('brandName')" prop="brandName" label="品牌名称" />
        <el-table-column v-if="columns.visible('image')" prop="image" label="品牌图片" />
        <el-table-column v-if="columns.visible('logogram')" prop="logogram" label="品牌助记码" />
        <el-table-column v-if="columns.visible('brandSort')" prop="brandSort" label="品牌排序" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="添加时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('isDel')" prop="isDel" label="是否删除" />
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

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'api/yxBrand', url: 'api/yxBrand', sort: 'id,desc', crudMethod: { ...crudYxBrand }})
const defaultForm = { id: null, brandName: null, image: null, logogram: null, brandSort: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'Brand',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
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
