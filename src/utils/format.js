import { dayjs } from 'element-plus'
// 一个格式化时间的工具
export const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')