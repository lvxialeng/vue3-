<script setup>
// const userStore = useUserStore()
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <div> 
    <el-config-provider :locale="zhCN">
      <!-- 配置路由出口 -->
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped>

</style>
