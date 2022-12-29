<template>
  <a-select
    v-model:value="entity"
    :labelInValue="labelInValue"
    :options="options"
    @change="handleChange"
    show-search
    :placeholder="placeholder"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    :mode="mode"
    @search="query"
  ></a-select>
</template>
    
<script>
import { ref,reactive } from "vue";
import { mapActions, useStore } from "vuex";


/**
* search-select 搜索选择器
* @param {String} labelInValue 是否显示label和value
* @param {String} placeholder 提示文字
* @param {String} mode 模式，可选值为 multiple/tags/combobox
* @param {String} value 当前值
* @param {String} module vuex store中的module名称
* @param {Object} valueMap 值字段的映射，设置{value:'idFieldName',label:'labelFieldName'}
* @param {String} action 请求的action
* @param {Object} param 请求的参数
* @example <search-select :labelInValue="true" :placeholder="'请输入关键字'" :mode="'tags'" :value="entity" :module="'ajaxSelect'" :valueMap="{value:'id',label:'name'}" :action="'getList'" :param="{name:keyword,limit:limit}"></search-select>
 */
export default {
  setup(props, context) {
    const options = ref([])
    const $store = useStore();

    const entity = reactive({})
    // 转换值
    if (props.labelInValue && props.valueMap !== undefined && (props.value !== undefined && props.value !== null)) {
      entity.value.value = props.value[props.valueMap.value]
      entity.value.label = props.value[props.valueMap.label]
    } else {
      entity.value = props.value
    }

    const handler = {
      $store,
      ...mapActions(props.module, { "query": props.action }),
    }
    const query = (val) => {
      let params = props.params !== undefined ? {} : { ...props.params }
      params.l = 10
      params.k = val
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
    // loadOpt()
    const handleChange = (value) => {
      if (props.valueMap !== undefined) {
        let v = {}
        v[props.valueMap.value] = value.value
        v[props.valueMap.label] = value.label
        context.emit("update:value", v)
        context.emit("change", v)
      } else {
        context.emit("update:value", value)
        context.emit("change", value)
      }
    }
    return {
      entity,
      options,
      handleChange,
      query
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
    valueMap: {
      type: Object //值字段的映射，设置{value:'idFieldName',label:'labelFieldName'}

    },
    labelField: {
      type: String,
      default: "name"
    },
    valueField: {
      type: String,
      default: "id"
    },
    module: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    params: {
      type: Object
    },
    mode: {
      type: String,
      default: "multiple"
    },
    placeholder: {
      type: String,
      default: "请输入关键词"
    },

  }
}
</script>
