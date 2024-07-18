<script setup>
import { 
  getArticleInfoService,
  updateArticleInfoService, 
  addArticleService 
} from '@/api/article'
import { ref, defineExpose, defineEmits } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

// 定义一个抽屉开关的变量后续访问它可以做到打开或者关闭组件
const drawer = ref(false)
// 定义一个默认信息以便于后续步骤中的重复使用
const defaultData = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})
const imgUrl = ref('')
// 直接给formModel赋值defaultData
const formModel = ref(Object.assign({}, defaultData.value))
// 定义一个向外暴露的函数,以便在父组件中可以更改变量以打开抽屉
const open = async (row) => {
  drawer.value = true
  // 进行判断,看打开抽屉时点的是哪个按钮
  if (row.id) {
    // 编辑模式
    const res = await getArticleInfoService(row.id)
    // 给formModel赋值接回来的数据,多的可以不访问就好
    formModel.value = res.data.data
    // 给url赋值,以便在完成图片内容更改但未调用接口上传图片时的图片回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    // 这里是点的添加按钮,也就是说数据并不需要回显在页面上,所以给空对象,以便后续数据响应式
    formModel.value = {...defaultData.value}
  }
}

// 将网络图片地址转换为 File 对象的函数(问的ai,对图片进行了一个数据转化,这个主要看后台接口怎么说)
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}
// 给按钮绑定事件, 在点按钮时也能做到打开文件选择器,选图片的操作
const onSelectFile = (file) => {
  imgUrl.value = URL.createObjectURL(file.raw)
  formModel.value.cover_img = file.raw
}

// 定义这样一个ref变量以便后续来调用其内部的方法或者云云的东西
const editRef = ref()
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 给state赋值,以便分辨是发布还是保存草稿
  formModel.value.state = state
  const fd = new FormData()
  // 遍历formModel.value,将其添加到FormData对象中(毕竟后台接口问我要的)
  for (let i in formModel.value) {
    fd.append(i, formModel.value[i])
  }
  // 编辑
  if (formModel.value.id) {
    await updateArticleInfoService(fd)
    ElMessage.success('修改成功')
    drawer.value = false
    emit('success', 'edit')
  } else {
    // 添加
    await addArticleService(fd)
    ElMessage.success('successfully add')
    emit('success', 'add')
  }
  // 这里的数据恢复默认值时,imgUrl和富文本编辑器的内容可能无法清空,所以需要手动添加
  formModel.value = { ...defaultData.value }
  imgUrl.value = ''
  editRef.value.setHTML('')
  drawer.value = false
}
// 暴露除去这个open方法
defineExpose({
  open
})
</script>

<template>
      <!-- 添加编辑的抽屉 -->
    <el-drawer 
    v-model="drawer" 
    title="look here" 
    size="50%"
    >
  <!-- 出现一个bug,在这里model和ref对应的值不能相同,因为ref绑定的对象名时这整个对象,而model绑定的只是数据,所以会导致model的值改变时ref的值也会改变,导致ref的对象名也会改变,最终会导致响应式的数据并不能更新.-->
      <el-form 
      :model="formModel"
      ref="formRef"
      label-width="100px">
        <el-form-item 
        label="文章标题"
        prop="title"
        >
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item 
        label="文章分类" 
        prop="cate_id"
        >
          <channel-select 
          v-model="formModel.cate_id"
          width="100%"></channel-select>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="editor">
            <quill-editor 
            ref="editRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"></quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
          <el-button @click="onPublish('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>