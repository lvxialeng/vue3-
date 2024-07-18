import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  // 1.基地址,超时时间
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 引入stores/user来判定用户是否携带了token
    const userStore = useUserStore()
    // 2.鞋带token
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err))

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 3.处理业务失败
    // 4.摘取核心相应数据
    if (res.data.code === 0) {
      return res
    }
    ElMessage.error(res.data.message || '请求失败')
    return Promise.reject(res.data)
  },
  (err) => {
    // 5.处理401错误
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 一般异常
    ElMessage.error(err.response.data.message || '请求失败')
    return Promise.reject(err)
  })

export default instance
export { baseURL }