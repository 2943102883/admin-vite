import http from '@/lib/http'

const RESTURL = 'util/link'
const API = {
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
  }
}
export default API
