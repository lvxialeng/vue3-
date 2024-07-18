<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { articleDeleteService, articleGetInfoService, articleUpdateInfoService } from '@/api/article'
import ChannelEdit from '@/components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义一个用于存放分类的容器
const channelList = ref([])
// 定义这么一个ref以便后续调用他内部的方法或者云云的东西(这个是组件关联的ref,指向组件)
const dialog = ref()
// 定义一个获取分类的函数
const getList = async () => {
  // 在请求时给body加上一个loading属性让用户体验更好一些
  isLoading.value = true
  const res = await articleGetInfoService()
  channelList.value = res.data.data
  // 结束
  isLoading.value = false
}
// 进入页面调用函数获取数据
onMounted(() => {
  getList()
})
// 给编辑按钮添加事件
const onEditChannel = async (row) => {
  dialog.value.open(row)
  // 调用接口
  await articleUpdateInfoService({...row})
}
// 使用组件提供的属性,这里先定义后续对其进行修改来达到目标效果
const isLoading = ref(false)
// 给删除按钮绑定点击事件
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('确定删除该分类吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  // 开启加载页面
  isLoading.value = true
  await articleDeleteService(row.id)
  ElMessage.success('删除成功')
  // 关闭加载页面
  isLoading.value = false
  getList()
}
// 打开dialog弹框
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="isLoading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"/>
      <el-table-column prop="cate_name" label="分类名称"/>
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column prop="address" label="操作" width="100">
        <template #default="{ row }">
            <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
  </el-table>
  <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="sass" scoped></style>