import Actions from './api'
import { setToken, getToken, setUser } from '@/lib/util'

const baseUrl = import.meta.env.VITE_API_PATH

export default {
  namespaced: true,
  state: {
    name: '', //用户的姓名

    uid: '', // 用户的账号

    role: {}, //用户的角色

    department: null, //用户所属的部门

    avatar: null,
    userInfo: null, //用户的其他扩展信息

    token: null, // JWT token

    opts: null, // 用户的个人设置

    menu: null // 用户的菜单
  },
  getters: {
    // opts: (state) => { // 从服务器获取配置
    //   if (state.opts === null) {
    //     console.log("state is null ")
    //   }
    // },
    userId(state) {
      return state.uid
    },
    userInfo(state) {
      return state.userInfo
    },
    userAvatar(state) {
      let token = getToken()
      return `${baseUrl}/user/${state.uid}/avatar?token=${token}&size=small`
    },
    userAvatarMed(state) {
      let token = getToken()
      return `${baseUrl}/user/${state.uid}/avatar?token=${token}&size=med`
    },

    userAvatarBig(state) {
      let token = getToken()
      return `${baseUrl}/user/${state.uid}/avatar?token=${token}&size=big`
    }
  },
  mutations: {
    name(state, name) {
      state.name = name
    },
    uid(state, uid) {
      state.uid = uid
    },
    role(state, role) {
      if (!role) return
      // let map = {};
      // role.forEach((item) => {
      //   map[item.id] = item;
      // });
      state.role = role
    },
    department(state, depart) {
      state.department = depart
    },
    avatar(state, avatar) {
      state.avatar = avatar
    },

    setAvatar(state, avatar) {
      state.userInfo.avatar = avatar
    },
    token(state, token) {
      if (token) {
        let tk = token
        state.token = tk
        setToken(tk)
      } else {
        state.token = token
        setToken(token)
      }
    },
    opts(state, opts) {
      state.opts = opts
    },
    menu(state, menu) {
      state.menu = menu
    },
    userInfo(state, user) {
      setUser(user)
      state.userInfo = user
    },
    logout(state) {
      setToken(false)
      state.token = false
      state.userInfo = null
      window.location.href = '/login'
    }
  },
  actions: {
    ...Actions
  }
}
