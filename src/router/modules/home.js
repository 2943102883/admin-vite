export default {
  // 系统管理 路由配置
  path: '/home',
  name: 'HomeIndex',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '首页',
    icon: 'Home',
    order: 1,
    auth: []
  }
  // children: [
  //   {
  //     // 基本信息:
  //     path: '/home/index',
  //     name: 'HomeIndex',
  //     meta: {
  //       title: '首页',
  //       auth: [],
  //       icon: 'Home',
  //       order: 1
  //     },
  //     component: () => import('@/views/home/index.vue')
  //   }
  // ]
}
