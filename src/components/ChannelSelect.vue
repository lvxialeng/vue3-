<script setup>
import { ref } from 'vue'
import { articleGetInfoService } from '@/api/article.js'
// 接受父组件传递过来的数据,并定义接受的类型只能是...(不用引入直接可以使用,因为返回的是一个props对象)
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
// 定义emit方法,来方便父组件调用子组件的事件
const emit = defineEmits(['update:modelValue'])
// 一个用于接受分类的容器
const channelList = ref([])
const getList = async () => {
  const res = await articleGetInfoService()
  channelList.value = res.data.data
}
getList()
</script>
<template>
  <el-select 
    :modelValue = 'modelValue'
    @update:modelValue = "emit('update:modelValue', $event)"
    :style="{width}"
  >
    <el-option
    v-for="item in channelList"
    :label="item.cate_name"
    :value="item.id"
    :key="item.id"
    ></el-option>
  </el-select>
</template>