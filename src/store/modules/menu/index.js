import { routes } from '@/router/modules'
import Cookies from 'js-cookie'

const getMenuList = () => {
  let list = Cookies.get('menuList')

  if (list) {
    return JSON.parse(list)
  } else {
    return []
  }
}

const detailChild = list => {
  if (!list) return []
  return list.filter(item => {
    if (item.children) {
      item.children = detailChild(item.children)
    }
    return !item.meta.isHide
  })
}

// routes as staticRoutes
const Menu = {
  namespaced: true,
  state: {
    authRouteMode: import.meta.env.VITE_AUTH_ROUTE_MODE,
    current: [],
    menuList: getMenuList()
  },
  getters: {
    menuList(state) {
      return state.menuList
    }
  },
  mutations: {
    setCurrent(state, name) {
      state.current = state[name]
    },
    setMenuList(state, list) {
      state.menuList = list
    }
  },
  actions: {
    setCurrent({ commit }, name) {
      commit('setCurrent', name)
    },
    initDynamicRoute({ commit }) {
      console.log('initDynamicRoute')
    },
    initStaticRoute({ commit }) {
      let menu = routes.filter(item => {
        if (!item.meta.isHide && item.children && item.children.length) {
          item.children = detailChild(item.children)
        }

        return !item.meta.isHide
      })

      Cookies.set('menuList', JSON.stringify(menu), {
        expires: 1
      })

      commit('setMenuList', menu)
    },

    async initAuthRoute({ commit, dispatch }) {
      const isDynamicRoute = import.meta.env.VITE_AUTH_ROUTE_MODE === 'dynamic'
      if (isDynamicRoute) {
        await dispatch('initDynamicRoute')
      } else {
        await dispatch('initStaticRoute')
      }
    }
  }
}

export default Menu
