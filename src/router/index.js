import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// 配置路由入门等信息
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        { path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue') },
        { path: '/article/channel', component: () => import('@/views/article/ArticleChannel.vue') },
        { path: '/user/profile', component: () => import('@/views/user/UserProfile.vue') },
        { path: '/user/avatar', component: () => import('@/views/user/UserAvatar.vue') },
        { path: '/user/password', component: () => import('@/views/user/UserPassword.vue') }
      ]
     },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }
  ]
})
// 路由守卫,在没有token的前提下拒绝访问首页或其他页面
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path!== '/login') return '/login'
})
export default router
