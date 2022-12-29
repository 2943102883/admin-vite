import http from '@/lib/http'

const RESTURL = 'iot-device'
const API = {
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
  one({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
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
  queryData({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get(RESTURL + `/${params.id}/action/data`, params.params)
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
  updateOnline({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      http
        .put(`${RESTURL}/${id}/action/online`, {})
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
  updateOffline({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      http
        .put(`${RESTURL}/${id}/action/offline`, {})
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
  getProduct({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get('iot-product', params)
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
  getCategory({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get('iot-category', params)
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
