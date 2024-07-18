import { userInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 一个对象
export const useUserStore = defineStore(
  // 名字
  'big-user', 
  () => {
    const token = ref('')
    const setToken = (newValue) => {
      token.value = newValue
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userInfoService()
      user.value = res.data.data
    }
    const setUser = (newObj) => {
      user.value = newObj
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
},{
  persist: true
})