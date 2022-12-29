import Vuex from 'vuex'
import config from '../config'
import { firstToUpper } from '@/utils/filters'
// 使用vuex-along来实现本地的状态持久化
import createVuexAlong from 'vuex-along'

// 自动加载文件夹下面的index.js
const module = import.meta.globEager('./modules/*/index.js')

const modules = Object.keys(module).reduce((modules, modulePath) => {
  let key = modulePath.replace(/(\.\/modules\/|\/index.js)/g, '')

  // firstToUpper

  modules[firstToUpper(key)] = module[modulePath].default

  return modules
}, {})
console.log('modules', modules)

const store = new Vuex.Store({
  state: {
    LOADING: true
  },
  getters: {
    loading: state => {
      return state.LOADING
    }
  },
  mutations: {
    showLoading(state) {
      state.LOADING = true
    },
    hideLoading(state) {
      state.LOADING = false
    }
  },
  actions: {
    //
  },
  modules: {
    ...modules
  },
  plugins: [
    createVuexAlong({
      name: config.name,
      local: {
        list: ['App', 'User', 'Role'],
        isFilter: false
      }
    })
  ]
})

export default store
