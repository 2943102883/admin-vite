import http from '@/lib/http'
import { getToken, setToken } from '@/lib/util'

const RESTURL = 'user'
const SELFRESTURL = 'self'
const CHANGE_PWD = 'user/action/update_pwd'
const SIGN_PATH = 'sign'
const LOGOUT_PATH = 'logout'

const TG_SIGN_PATH = 'sign'
const TG_LOGOUT_PATH = 'logout'

var baseUrl = import.meta.env.VITE_API_UPLOAD

const ImgUrl = 'file/img'
const delImg = 'file/img'
export const userAvatar = (uid, size) => {
  let url = baseUrl + '/user/' + uid + '/avatar?token=' + getToken()
  if (size) {
    url = url + '&size=' + size
  }
  return url
}

export const userModuleAvatar = (id, size) => {
  let url = `${baseUrl}/file/${id}?token=` + getToken()
  if (size) {
    url = url + '&size=' + size
  }

  return encodeURI(url)
}

const API = {
  /**
   *
   * @param commit
   * @param dispatch
   * @param user
   * @param pass
   * @returns {Promise<unknown>}
   */
  doLogin({ commit, dispatch }, { user, pass, type }) {
    return new Promise((resolve, reject) => {
      http
        .post(SIGN_PATH, {
          userName: user,
          password: pass,
          type: type
        })
        .then(res => {
          let user = res

          commit('name', user.name)
          commit('uid', user.id)
          commit('role', user.role)
          // commit("token", user.token)
          commit('avatar', user.avatar)
          commit('userInfo', user)
          dispatch('Menu/initAuthRoute', {}, { root: true })
          // dispatch("userMenu")
          setToken(user.token)
          resolve(user)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  // 新的后端API
  TGdoLogin({ commit, dispatch }, { user, pass }) {
    return new Promise((resolve, reject) => {
      http
        .post(TG_SIGN_PATH, {
          userName: user,
          password: pass
        })
        .then(res => {
          let user = res
          commit('name', user.name)
          commit('uid', user.id)
          commit('role', user.role)
          // commit("token", user.token)
          commit('avatar', user.avatar)
          commit('userInfo', user)
          // dispatch("userMenu")
          setToken(user.token)
          resolve(user)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  /**
   *
   * @param commit
   * @param dispatch
   * @returns {Promise<unknown>}
   */
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      http
        .post(LOGOUT_PATH)
        .then(res => {
          commit('name', '')
          commit('uid', '')
          commit('role', null)
          commit('token', null)
          commit('avatar', '')
          commit('userInfo', null)
          commit('menu', null)
          resolve(res)
        })
        .catch(error => {
          console.log('logout')
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          commit('name', '')
          commit('uid', '')
          commit('role', null)
          commit('token', null)
          commit('avatar', '')
          commit('userInfo', null)
          commit('menu', null)
          reject(error)
        })
      window.clearVuexAlong()
    })
  },
  /**
   * 新的后端API
   * @param commit
   * @param dispatch
   * @returns {Promise<unknown>}
   */
  TGLogout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      http
        .post(TG_LOGOUT_PATH)
        .then(res => {
          commit('name', '')
          commit('uid', '')
          commit('role', null)
          commit('token', null)
          commit('avatar', '')
          commit('userInfo', null)
          commit('menu', null)
          resolve(res)
        })
        .catch(error => {
          console.log('logout')
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          commit('name', '')
          commit('uid', '')
          commit('role', null)
          commit('token', null)
          commit('avatar', '')
          commit('userInfo', null)
          commit('menu', null)
          reject(error)
        })
      window.clearVuexAlong()
    })
  },
  /**
   * 获取用户的个人配置，包括菜单配置
   * @param commit
   * @param dispatch
   * @param user
   */
  loadUserOpts({ commit, dispatch }, { user }) {
    http
      .get('keystone/user_options', {
        id: user.loginID
      })
      .then(res => {
        commit('opts', res)
      })
      .catch(error => {
        dispatch(
          'pushError',
          {
            error
          },
          {
            root: true
          }
        )
        console.log(error)
        //
      })
  },
  userMenu({ commit, dispatch }) {
    http
      .get('keystone/menu')
      .then(res => {
        commit('menu', res)
      })
      .catch(error => {
        dispatch(
          'pushError',
          {
            error
          },
          {
            root: true
          }
        )
      })
  },
  create({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .post(RESTURL, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  update({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .put(RESTURL + '/' + data.id, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  delete({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      http
        .delete(RESTURL, {
          id
        })
        .then(res => {
          const u = res
          resolve(u)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  load({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      http
        .get(RESTURL + '/' + id)
        .then(res => {
          const u = res.data
          resolve(u)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  self({ dispatch }) {
    return new Promise((resolve, reject) => {
      http
        .get(SELFRESTURL)
        .then(res => {
          const u = res
          resolve(u)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  selfUpdate({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .put(SELFRESTURL, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  query({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get(RESTURL, params)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  uploadAvatar({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(RESTURL + '/' + id + '/' + 'avatar', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userChangePwd({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      http
        .put(CHANGE_PWD, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  // 角色
  userAllRole({ dispatch }, { id, param }) {
    return new Promise((resolve, reject) => {
      http
        .get(`${RESTURL}/${id}/role`, param)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userAddRole({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .put(`${RESTURL}/${id}/addRole`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },

  userDeleteRole({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .put(`${RESTURL}/${id}/removeRole`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  // 组织
  userAllOrg({ dispatch }, { id, param }) {
    return new Promise((resolve, reject) => {
      http
        .get(`${RESTURL}/${id}/org`, param)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userAddOrg({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`${RESTURL}/${id}/add_org`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userSetOrg({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`${RESTURL}/${id}/set_org`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userDeleteOrg({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`${RESTURL}/${id}/rm_org`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  // 部门
  userAllDept({ dispatch }, { userID, data }) {
    return new Promise((resolve, reject) => {
      http
        .get(`${RESTURL}/${userID}/dept`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userAddDept({ dispatch }, { userID, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`${RESTURL}/${userID}/adddept`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userSetDept({ dispatch }, { userID, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`${RESTURL}/${userID}/setdept`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  userDeleteDept({ dispatch }, { userID, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`${RESTURL}/${userID}/rmvdept`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  uploadAvatars({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .post(ImgUrl, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },

  DeleteAvatar({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      http
        .delete(delImg, {
          id
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  },
  updateImg({ dispatch }, { id, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(`user/${id}/avatar`, data)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch(
            'pushError',
            {
              error
            },
            {
              root: true
            }
          )
          reject(error)
        })
    })
  }
}
export default API
