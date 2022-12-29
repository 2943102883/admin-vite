export default {
  namespaced: true,
  state: {
    opts: null, //系统配置

  },
  getters: {
    opts: (state) => { // 从服务器获取配置
      // if (state.opts === null) {
        // console.log(state);
      // }
    }
  },
  mutations: {

  },
  actions: {

  }
}
