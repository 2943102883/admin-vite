<template>
  <a-radio-group :options="options" v-model:value="proValue" @change="change"/>
</template>
<script>

import { ref } from "vue";
import { mapActions, useStore } from "vuex";
export default {
  setup(props, context) {
    const options = ref([])
    const proValue=ref(props.value)
    const $store = useStore();
    const handler = {
      $store,
      ...mapActions(props.module, [props.action]),
    }
    const loadOpt = () => {
      let params = props.params !== undefined ? props.params : { l: 0 }
      handler.query(params).then(res => {
        if (res.data === undefined || res.data === null || res.data.length === 0) {
          return
        }
        let opt = []
        for (let i = 0; i < res.data.length; i++) {
          opt.push({
            label: res.data[i][props.labelField],
            value: res.data[i][props.valueField]
          })
        }

        options.value = opt
      }).catch(err => {
        console.log(err)
      })
    }
    loadOpt()
    const change=(value)=>{
      context.emit("update:value",proValue.value)
      context.emit("achange", proValue.value)
    }
    // const handleChange = (value,option) => {
    //   console.log(value);
    //   
    //   
    // }
    return {
      options,
      // handleChange,
      proValue,
      change
    }

  },
  props: {

    value: {
      type: Object,
      required: true
    },
    labelInValue: {
      type: Boolean,
      default: false

    },
    labelField: { //服务端返回的数据中，用作选项标签的字段
      type: String,
      default: "name"
    },
    valueField: {//服务端返回的数据中，用作选项值的字段
      type: String,
      default: "id"
    },
    module: { //关联的功能模块
      type: String,
      required: true
    },
    action: { //获取选项的api,一般使用的是查询接口
      type: String,
      required: true
    },
    params: {// 附带的查询参数，如果设置，那么获取选项列表时，会作为查询的参数
      type: Object
    },
    mode: {//设置 Select 的模式为多选或标签
      type: String,
      default: "default"
    }

  }
}
</script>

<style scoped>
</style>