<script setup>
// 接受父组件传递过来的数据,并定义接受的类型只能是...(不用引入直接可以使用,因为返回的是一个props对象)
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
<!-- 这个组件是一个复用的框架 -->
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
