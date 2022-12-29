import http from '@/lib/http'

const API = {
  queryNodeType({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get('info-land-node-type', params)
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
