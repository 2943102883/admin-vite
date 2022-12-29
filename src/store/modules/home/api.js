import http from '@/lib/http'

const API = {
  //  管理端首页 API
  adminStatistics({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get(`index/admin/statics`, params)
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
  // 学期接口
  getTerm({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get('term', params)
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
  //  学校端首页 API
  schoolStatistics({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      http
        .get(`index/school/statics`, params)
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
  //  机构端首页 API
  orgStatistic({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .get(`index/org/statics`, data)
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
  // 配餐端首页 API
  cateringStatistic({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      http
        .get(`index/catering/statics`, data)
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
