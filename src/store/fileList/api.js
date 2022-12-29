import http from '@/lib/http'

// 文件和图片 API

const ImgUrl = 'file/img'
const delImg = 'file/img'
const delDoc = 'file/doc'
const FileUrl = 'file/doc'

const API = {
  createFile({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .post(FileUrl, data)
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

  queryFile({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .get(FileUrl, data)
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

  queryImg({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .get(ImgUrl, data)
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

  createImg({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .post(ImgUrl, data)
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

  deleteImg({ dispatch }, { id }) {
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
  deleteFile({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      http
        .delete(delDoc, {
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
  }
}
export default API
