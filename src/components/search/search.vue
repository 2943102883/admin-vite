<template>
  <div class="d-workspace" :style="backStyle">
    <div class="d-workspace-header">
      <slot name="header"></slot>
    </div>
    <div class="d-workspace-body center-all">
      <a-tabs v-if="services" v-model:activeKey="activeKey"   @change="change">
        <a-tab-pane v-for="(item ) in services" :key="item.key" :tab="item.title">{{item.desc}}</a-tab-pane>
      </a-tabs>
      <a-input-search
        class="m-top-w"
        v-model:value="keyword"
        placeholder="输入搜索关键词"
        enter-button="搜索"
        size="large"
        @search="onSearch"
        :style="{'width':width}"
      />
    </div>
    <slot name="keyword"></slot>
    <div class="d-workspace-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, ref,watch } from 'vue'
import { mapActions, useStore } from "vuex"

export default defineComponent({
  setup(props, context) {
    const keyword = ref()
    const activeKey = ref("All")
    let serviceMap = {}
    let serviceHandle = {
      $store: useStore()
    }// 服务的action
    console.log(activeKey);
    // 建立服务的映射
    if (props.services !== undefined && props.services !== null) {
      for (let i = 0; i < props.services.length; i++) {
        let serv = props.services[i]
        serviceMap[serv.key] = serv
        let action = {}
        action[serv.key] = serv.api.action
        serviceHandle = {
          ...serviceHandle,
          // 这里map的，就是module里面指定的查询方法
          ...mapActions(serv.api.module, action)
        }
      }
    }
    // 根据属性设置背景
    const backStyle = computed(() => {
      let style = {

      }
      if (props.gradient) {
        console.log(props.gradient);
        style['background-color'] = props.gradient.color[0]
        if (props.gradient.color[1]) {
          if (props.gradient.deg === undefined) {
            props.gradient.deg = '0deg'
          }
          style['background-image'] = `'${props.background}' linear-gradient(${props.gradient.deg}, ${props.gradient.color[0]} 0%, ${props.gradient.color[1]} 100%)`
        }

      }
      console.log("background", props.background)
      if (props.background) {
        style['background-image'] = `url(${props.background})`
      }
      return style
    })
    
    watch(()=> props.current,()=>{
      onSearch()
    })
    const onSearch = () => {
      let param = {
        s:((props.current??1)-1)*10,
        k: keyword.value,
        l: 10
      }
      console.log("param",param.s);
      if (props.services !== undefined) {
        param.service = serviceMap[activeKey.value]
      }
      context.emit('search',{param,activeKey: activeKey.value})
      serviceHandle[activeKey.value](param).then(res => {
        context.emit("result", { param, result: res })
      }).catch(err => {
        context.emit("error", { param, result: res })
      })
    }

    const change = (key) => {
      context.emit("change", key)
    }
    
    return {
      keyword,
      backStyle,
      activeKey,
      onSearch,
      change
    }

  },
  props: {
    width: {
      type: [String, Number],
      default: "480px"
    },
    background: {
      type: String,
    },
    gradient: {//背景渐变的设置，如果没有设置，则采用单色模式
      // 属性 color数组,deg:角度
      type: Object

    },
    title: {
      type: String,
      default: "",
    },
    toPath: {
      type: String,
      default: "Home",
    },
    current:{
      type:Number,
      default:1
    },
    services: {//配置提供搜索的服务
      // 每个搜索服务需要配置以下属性: title,api,icon,key,desc
      // api 是一个对象，里面包括 module, action,
      type: Array,
      required: true
    }
  },
})
</script>
<style  lang="less" scoped>
.search-space {
  background-size: 100% 100%;
}
.align-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}

.center-all {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

