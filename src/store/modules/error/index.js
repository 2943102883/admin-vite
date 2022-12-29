import { message } from 'ant-design-vue'
import { setToken } from '@/lib/util'
import routes from '@/router'

const Error = {
  state: {
    apiError: [], // 后端API错误
    toasts: false, // 是否显示toasts
    title: '', // toasts中显示的错误标题
    message: 'somemessage' // 错误信息
  },
  getters: {
    apiError: state => {
      return state.apiError
    },
    toasts: state => {
      return state.toasts
    },
    message: state => {
      return state.message
    }
  },
  mutations: {
    addError: (state, error) => {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          // 未登录
          setToken(false)
          if (window.location.pathname !== '/login') {
            message.error('登录超时，请重新登录！')
            routes.replace({
              name: 'login'
            })
          }

          return
        } else if (error.response.status >= 400) {
          // message.error(error.response.data.msg)
          return
        }
      }

      // if (error.code == 'ERR_NETWORK') {
      //   setToken(false)
      //   if (window.location.pathname !== '/login') {
      //     message.error('登录超时，请重新登录！')
      //     routes.replace({
      //       name: 'login'
      //     })
      //   }
      // }

      state.toasts = true
      state.message = error
      if (state.apiError.length > 10) {
        state.apiError.pop()
      }
      state.apiError.push(error)
    },
    closeToasts: (state, status) => {
      state.toasts = status
      state.message = ''
    }
  },
  actions: {
    pushError({ commit }, { error }) {
      // 收集错误，根据错误类型采取不同的处理方式
      commit('addError', error)
    }
  }
}

export default Error
