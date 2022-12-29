import http from '@/lib/http'

const RESTURL = 'note/'
const API = {
  create({ dispatch }, { module, moduleID, data }) {
    return new Promise((resolve, reject) => {
      http
        .post(RESTURL + module + '/' + moduleID, data)
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
  update({ dispatch }, { module, moduleID, data }) {
    return new Promise((resolve, reject) => {
      http
        .put(RESTURL + module + '/' + moduleID + '/' + data.id, data)
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
  delete({ dispatch }, { module, moduleID, id }) {
    return new Promise((resolve, reject) => {
      http
        .delete(RESTURL + module + '/' + moduleID, {
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
  one({ dispatch }, { module, moduleID, id }) {
    return new Promise((resolve, reject) => {
      http
        .get(RESTURL + module + '/' + moduleID + '/' + id)
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
  query({ dispatch }, { module, moduleID, params }) {
    return new Promise((resolve, reject) => {
      http
        .get(RESTURL + module + '/' + moduleID, params)
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
