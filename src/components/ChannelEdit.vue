<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import { articleAddService, articleUpdateInfoService } from '@/api/article'
// 定义变量来控制弹框的显示与隐藏
const dialogVisible = ref(false)
// 同上,定义方法来控制
const open = (row) => {
  dialogVisible.value = true
  // 给弹框的formModel赋值
  // ATTENTION 这里给formModel赋值了row的值,这时候可能会为其添加上一个名为id的属性
  formModel.value = { ...row }
}
// 与下方el-form做数据绑定
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 给el-input绑定校验规则(隐式校验)
const rules = {
  // 此处使用正则校验
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名称必须是1-10位非空字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名需为1-10位非空字符', trigger: 'blur' } 
  ]
}
// 用来绑定dom元素
// 类似于v2的事件名,来告诉父子间有这个事件,让他调用函数来实现效果
const emit = defineEmits(['success'])
const formRef = ref()
const onSubmit = async () => {
  // 显示校验 与rules规则相辅相成(且为异步校验)
  await formRef.value.validate()
  // 发送请求
  if (formModel.value.id) {
    await articleUpdateInfoService({ ...formModel.value })
    ElMessage.success('编辑成功')
  } else {
    await articleAddService({ ...formModel.value })
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
// 暴露出方法
defineExpose({
  open
})
</script>
<template>
  <!-- elementPlus的弹框组件 -->
    <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '新增分类'"
    width="30%"
    >
  <!-- el-form来做弹框的两个input框来收集信息 -->
    <el-form 
    ref="formRef" 
    :model="formModel" 
    :rules="rules" 
    label-width="100px" 
    style="padding-right: 30px">
      <!-- 给item添加prop来匹配具体的规则 -->
      <el-form-item label="分类名称" prop="cate_name">
        <!-- 添加v-model实现数据响应式 -->
        <el-input 
        v-model="formModel.cate_name" 
        placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <!-- 给item添加prop来匹配具体的规则 -->
      <el-form-item label="分类别名" prop="cate_alias">
        <!-- 添加v-model实现数据响应式 -->
        <el-input 
        v-model="formModel.cate_alias" 
        placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button 
        type="primary" 
        @click="onSubmit"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>