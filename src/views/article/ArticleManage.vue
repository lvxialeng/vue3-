<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteArticleInfoService, getArticleListService } from '@/api/article'
import { formatTime } from '@/utils/format'

// 定义这么一个ref以便后续调用他内部的方法或者云云的东西
const articleRef = ref()
// 定义请求参数对象
const paramsObj = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
// 基于params参数，获取文章列表
const dataList = ref([])
const total = ref(0)
const loading = ref(false)
const getList = async () => {
  loading.value = true
  const res = await getArticleListService(paramsObj.value)
  dataList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getList()

// 处理分页逻辑
const onSizeChange = (size) => {
  // 如果变化率则返回第一页并且重新请求数据
  paramsObj.value.pagenum = 1
  paramsObj.value.pagesize = size
  getList()
}
const onCurrentChange = (currentPage) => {
  paramsObj.value.pagenum = currentPage
  getList()
}

// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  paramsObj.value.pagenum = 1
  getList()
}
// 重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  paramsObj.value.pagenum = 1
  paramsObj.value.cate_id = ''
  paramsObj.value.state = ''
  getList()
}

// 添加逻辑
const onAdd = () => {
  // 打开抽屉
  articleRef.value.open()
}
// 编辑逻辑
const onEdit = (row) => {
  // 打开编辑抽屉
  articleRef.value.open(row)
}

// 删除逻辑
const onDelete = async (row) => {
  await ElMessageBox.confirm('此操作将永久删除该文章, 是否继续?','提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 调用接口api
  await deleteArticleInfoService(row.id)
  ElMessage.success('删除成功')
  getList()
}
// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 向上取整，total是还没加上新增那一条的数据总数。。再除以pagesize就得到了最后一页的页码
    // 以最后一页的页面为标准来获取数据，以防用户在添加完后反馈不明确造成的困扰
    const lastPage = Math.ceil((total.value + 1) / paramsObj.value.pagesize)
    paramsObj.value.pagenum = lastPage
  }
  
  getList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAdd">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <!-- 得益于pinia所以不用导入直接使用编好 -->
        <channel-select v-model="paramsObj.cate_id" width="200px"></channel-select>
        <!-- Vue3 => v-model:cid  :cid 和 @update:cid 的简写 -->
        <!-- <channel-select v-model:cid="params.cate_id"></channel-select> -->
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="paramsObj.state" style="width: 200px;">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="dataList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default=" { row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEdit(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelete(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:currentPage="paramsObj.pagenum"
      v-model:page-size="paramsObj.pagesize"
      :page-sizes="[2, 4, 5, 10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <article-edit ref="articleRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
