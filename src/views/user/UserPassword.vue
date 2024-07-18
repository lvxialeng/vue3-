<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { userChangePwdService } from '@/api/user'

// 定义这么一个ref以便后续调用他内部的方法或者云云的东西
const formRef = ref()
// 定义一个响应式数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 校验新密码和确认密码是否相同
const checkSameAsNewPwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码必须和新密码一样'))
  } else {
    callback()
  }
}

// 新密码和原密码不能一样的规则
const checkDifferent = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码一样'))
  } else {
    callback()
  }
}

// 规则内部配一下再校验
const rules = ref({
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '新密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '确认密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

// 定义pinia来清除token等信息
const userStore = useUserStore()
// 定义路由好跳转页面
const router = useRouter()
const submitForm = async () => {
  // 校验一下表单
  await formRef.value.validate()
  // 调用接口更改密码
  await userChangePwdService(pwdForm.value)
  ElMessage.success('密码修改成功')
  // 提交完最后返回login页面
  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})
  router.replace('/login')
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="修改密码">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form></el-col
      >
    </el-row>
  </page-container>
</template>