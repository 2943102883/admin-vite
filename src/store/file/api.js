import http from '@/lib/http'
import { getToken } from '@/lib/util'

var baseUrl = import.meta.env.VITE_API_UPLOAD

const RESTURL = 'doc/file'

export const fileUrl = ({ id, name, size, stamp }) => {
  let url = `${baseUrl}/file/pub/img/${id}/${name}`
  if (size) {
    url = url + '&size=' + size
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
  let url = baseUrl + 'pub/file/' + id + '?a=a'
  if (size) {
    url = url + '&size=' + size
  }
  if (name) {
    url = url + '&name=' + name
  }
  return url
}
const API = {
  create(
    { dispatch },
    {
      module,
      moduleId,
      data,
      //此处应该还有一个回调函数为cb，为进度条的回调函数
      onUploadProgress
    }
  ) {
    return new Promise((resolve, reject) => {
      let path = module ? RESTURL + '/' + module + '/' + moduleId : RESTURL
      http
        .post(path, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 1800000,
          onUploadProgress
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
      /*
                  http.request(
                      {
                          path,
                          data,
                          method: 'post'
                      })
      */
    })
  },
  uploadAvatar({ dispatch }, { path, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(path, data, {
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
  delete({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      // let path = module ? RESTURL + "/" + module + "/" + moduleId : RESTURL
      http
        .delete(RESTURL + '/' + id)
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
        .get(RESTURL + '/' + id)
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
        .get(RESTURL + '/' + id + '?token=' + getToken(), {
          responseType: 'arraybuffer'
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          dispatch('pushError', { error }, { root: true })
          reject(error)
        })
    })
  },
  queryModule({ dispatch }, { module, moduleId, params }) {
    return new Promise((resolve, reject) => {
      let path = module ? RESTURL + '/' + module + '/' + moduleId : RESTURL
      http
        .get(path, params)
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
