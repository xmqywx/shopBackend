<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="已上架商品" name="first">
      <onSale ref="onSale" />
    </el-tab-pane>
    <el-tab-pane label="待上架商品" name="second">
      <unonSale ref="unonSale" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import onSale from '@/views/shop/goods/index'
import unonSale from '@/views/shop/goods/index2'
import '@/assets/styles/description.scss'
export default {
  name: 'Tab',
  components: { onSale, unonSale },
  data() {
    return {
      activeName: this.$route.query.isShow === 0 ? 'second' : 'first'
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'first') {
        this.$refs.onSale.init()
      } else if (this.activeName === 'second') {
        this.$refs.unonSale.init()
      }
    }
  }
}
</script>

<style scoped>
</style>
