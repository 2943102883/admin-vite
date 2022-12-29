import { routes } from '../modules'
import layoutMain from '@/components/layoutMain'

/** 根路由: / */
export const ROOT_ROUTE = {
  name: 'root',
  path: '/',
  redirect: import.meta.env.VITE_ROUTE_HOME_PATH,
  meta: {
    title: 'Root'
  }
}

export default [
  ROOT_ROUTE,
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/NavFrame',
    name: 'NavFrame',
    component: layoutMain,

    children: routes
  }
]
