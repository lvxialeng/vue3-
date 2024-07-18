// 初始化pinia配置
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
export default pinia

// 导入实际的store文件
// 下述等同于 先导入 后导出
export * from './modules/user'