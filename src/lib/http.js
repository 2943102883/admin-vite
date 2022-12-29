import axios from 'axios'
import QS from 'qs'
import { setToken, getToken, getUser } from './util'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function reData(response) {
  if (response.data !== undefined) {
    return response.data
  } else {
    return null
  }
}

function startLoading() {
  //使用Element loading-start 方法
  // loading = Loading.service({
  //   lock: true,
  //   text: "努力加载中……",
  //   background: "rgba(0, 0, 0, 0.5)"
  // })
  // message.loading("努力加载中……", 0)
}

function endLoading() {
  //使用Element loading-close 方法
  // loading.close()
  // message.destroy()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

const serverCodeMessage = {
  200: '服务器成功返回请求的数据',
  400: '请求出错！',
  401: '登录超时，请重新登录!',
  403: '未登录,请登录!',
  404: '请求地址出错！',
  500: '服务器发生错误，请检查服务器(Internal Server Error)',
  502: '网关错误(Bad Gateway)',
  503: '服务不可用，服务器暂时过载或维护(Service Unavailable)',
  504: '网关超时(Gateway Timeout)'
}

/**
 *
 */
export class HttpReq {
  /**
   *
   * @param baseUrl
   * @param keepAuth //保持登录
   * @param tokenFunc  //获取token的函数
   * @param contentType //请求提交的类型
   */
  constructor({
    baseUrl = '/',
    keepAuth,
    tokenFunc = () => {
      return getToken()
    },
    contentType = 'application/jsoncharset=UTF-8',
    timeout = 18000
  }) {
    this.baseUrl = baseUrl
    this.queue = {}
    this.send = false
    this.keep = keepAuth
    this.tokenFunc = tokenFunc
    this.contentType = contentType
    let instance = axios.create({
      baseURL: this.baseUrl
      // headers: {
      //   'Content-Type': 'application/json; charset=utf-8'
      // }
    })
    this.instance = instance

    //1.请求超时时间
    instance.defaults.timeout = timeout
    //2.post请求头
    instance.defaults.headers.post['Content-Type'] = this.contentType
    // "application/jsoncharset=UTF-8"
    //3.公共部分(请求带token设置)
    // instance.defaults.headers.common['Authorization'] = Store.state.token
    //4.返回数据类型的定义
    instance.defaults.responseType = 'json'
    //5.带cookie请求
    instance.defaults.withCredentials = false

    // 请求拦截器
    instance.interceptors.request.use(
      config => {
        const token = this.tokenFunc()
        // console.log("user", getUser());
        token && (config.headers.Authorization = 'Bearer ' + token)
        // console.log("user", config);
        // config.headers['Refresh-Token'] = true
        // config.headers.Accept = this.contentType //规定接受形式json格式

        // if (config.method == 'get') {
        //   config.data = { unused: 0 }
        //   config.headers['Content-Type'] = this.contentType //规定接受形式json格式
        // }

        showFullScreenLoading() //开启loading
        if (config.method === 'get') {
          // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2,不转换会显示为arr[]=1&arr[]=2
          config.paramsSerializer = function (params) {
            return qs.stringify(params, {
              arrayFormat: 'repeat'
            })
          }
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    instance.interceptors.response.use(
      response => {
        // console.log(response, 'response响应拦截器')
        // // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // //否ad
        // if (response.status === 200) {
        tryHideFullScreenLoading() //关闭loading
        // 尝试获取JWT Token
        // 服务端响应会包含两个header 属性
        // set-token : 新的token
        // token-expires: token失效的时间，单位为分钟
        // let token = response.headers['Set-Token']
        // if (token) {
        //   setToken(token)
        // }
        return Promise.resolve(response)
        // } else {
        //   message.warning(serverCodeMessage[response.status])
        //   return Promise.reject(response)
        // }
      },
      error => {
        console.log('响应拦截器', error)
        console.log('响应拦截器', error.response)

        return Promise.reject(error)
        // if (error.response) {
        //   if (error.response.status === 401 || error.response.status === 403) {
        //     setToken(false);
        //     if ( route.name !== 'login') {
        //       router.push({name:'login',query: { fullPath: route.fullPath }})
        //       window.localStorage.setItem('type',null)
        //     }
        //   }
        //   return Promise.reject(error);
        // }
      }
    )
  }
  get(url, params, config) {
    return new Promise((resolve, reject) => {
      if (params) {
        url =
          '/' +
          url +
          '?' +
          QS.stringify(params, {
            arrayFormat: 'repeat'
          })
      } else {
        url = '/' + url
      }
      this.instance
        .get(url, config)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  post(url, data, config) {
    return new Promise((resolve, reject) => {
      this.instance
        .post('/' + url, data, config)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  put(url, data, config) {
    return new Promise((resolve, reject) => {
      this.instance
        .put('/' + url, data, config)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  delete(url, params, config) {
    return new Promise((resolve, reject) => {
      if (params && Object.keys(params).length) {
        url = '/' + url + '/' + encodeURIComponent(params.id)
      } else {
        url = '/' + url
      }

      this.instance
        .delete(url, config)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
          console.log('dell', config)
        })
    })
  }
}

const http = new HttpReq({
  baseUrl: import.meta.env.VITE_API_PATH
})

export default http
