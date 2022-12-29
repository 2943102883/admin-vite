let baseWebURL = '/'

const cfg = {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '',

  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 100,
  timeout: 10000,
  /**
   *  vuex-along 本地存储的名称，用于区分其他前端服务,每个项目请修改这个名称
   */
  localStoreName: 'atom-antd',
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: import.meta.env.VITE_API_PATH,
    test: import.meta.env.VITE_API_PATH,
    // 修改成读取环境变量，环境变量为空则默认为localhost:3333,在vue.config.js注入
    // pro: "https://edu.ysbus.com:3005",
    pro: import.meta.env.VITE_API_PATH
  },

  baseWebURL: baseWebURL,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'HomeIndex',
  loginName: 'login',
  loginOut: 'logout',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
export default cfg
