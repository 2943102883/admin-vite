import http from '@/lib/http'
import { getToken } from '@/lib/util'

var baseUrl = import.meta.env.VITE_API_UPLOAD

const RESTURL = 'file'

export const fileUrl = ({ id, name, size, stamp }) => {
  let url =
    baseUrl + cfg.baseWebURL + RESTURL + '/' + id + '?token=' + getToken()
  if (size) {
    url = url + '&size=' + size
  }
  if (name) {
    url = url + '&name=' + name
  }
  if (stamp) {
    url = url + '&s=' + stamp
  }
  return url
}
export const viewUrl = ({ id, name, size, stamp }) => {
  let url = baseUrl + '/' + RESTURL + '/' + id + '?token=' + getToken()
  if (size) {
    url = url + '&size=' + size
  }
  if (name) {
    url = url + '&name=' + name
  }
  if (stamp) {
    url = url + '&s=' + stamp
  }
  return url
}
export const pubUrl = ({ id, name, size }) => {
  let url = baseUrl + cfg.baseWebURL + 'pub/file/' + id + '?a=a'
  if (size) {
    url = url + '&size=' + size
  }
  if (name) {
    url = url + '&name=' + name
  }
  return url
}
const API = {
  create({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .post(RESTURL, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          baseURL: import.meta.env.VITE_API_UPLOAD
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
  uploadAvatar({ dispatch }, { path, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(path, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          baseURL: import.meta.env.VITE_API_UPLOAD
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
  delete({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      http
        .delete(
          RESTURL + '/' + id,
          {},
          {
            baseURL: import.meta.env.VITE_API_UPLOAD
          }
        )
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
  query({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      // let path = module ? RESTURL + "/" + module + "/" + moduleId : RESTURL
      http
        .get(
          RESTURL + '/' + id,
          {},
          { baseURL: import.meta.env.VITE_API_UPLOAD }
        )
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
  downloadFile({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      http
        .get(
          RESTURL + '/' + id + '?token=' + getToken(),
          {},
          {
            baseURL: import.meta.env.VITE_API_UPLOAD,
            responseType: 'arraybuffer'
          }
        )
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch('pushError', { error }, { root: true })
          reject(error)
        })
    })
  },
  queryModule({ dispatch }, { module, moduleId }) {
    return new Promise((resolve, reject) => {
      let path = module ? RESTURL + '/' + module + '/' + moduleId : RESTURL
      http
        .get(path)
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
