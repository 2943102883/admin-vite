<template>
  <a-select
    v-model:value="values"
    :mode="mode"
    :show-search="true"
    label-in-value
    placeholder="搜索选中"
    style="width: 100%"
    option-label-key="label"
    :filter-option="false"
    :disabled="disabled"
    :options="data"
    allowClear
    @search="onSearch"
    @change="onChange"
    @focus="onFocus"
  >
    <template v-if="fetching" #notFoundContent>
      <a-spin size="small" />
    </template>
    <!-- <template v-else-if="!data.length" #notFoundContent>
      <p>没有</p>
    </template> -->
  </a-select>
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  watch,
  onUnmounted
} from 'vue'
import { mapActions, useStore } from 'vuex'
/**
 * @description: AjaxSelect 组件
 * @prop {String} mode - 模式，可选值为 multiple, tags, combobox, default: 'default'
 * @prop {String} storeModel - vuex store中的model名称, 必填
 * @prop {String} title - 显示的标题
 * @prop {String} value - 当前选中的值
 * @prop {Number} limit - 每次请求的数据条数
 * @prop {String} optionField - 选项来源的字段
 */
export default defineComponent({
  setup(props, { emit }) {
    const $store = useStore()
    const handle = {
      $store,
      ...mapActions(props.storeModel, ['query'])
    }

    window.sessionStorage.setItem(
      'queryParams',
      JSON.stringify(props.params) || '{}'
    )
    onUnmounted(() => {
      window.sessionStorage.removeItem('queryParams')
    })
    const query = value => {
      state.fetching = true
      const params =
        JSON.parse(window.sessionStorage.getItem('queryParams')) || props.params
      if (Array.isArray(params.schoolId)) {
        let totalData = []
        let schoolIds = params.schoolId
        delete params.schoolId
        schoolIds.forEach(id => {
          handle
            .query({
              ...params,
              schoolId: id,
              k: value,
              l: props.limit
            })
            .then(res => {
              if (res && res.data) {
                const data = res.data.map(r => ({
                  label: r[props.replaceFieldsLable],
                  value: r.id
                }))
                totalData = totalData.concat(data)
                let obj = {}
                totalData = totalData.reduce((item, next) => {
                  obj[next.value]
                    ? ''
                    : (obj[next.value] = true && item.push(next))
                  return item
                }, [])
                state.data = totalData
                state.fetching = false
              }
            })
        })
      } else {
        handle.query({ l: props.limit, k: value, ...params }).then(res => {
          if (res && res.data) {
            const data = res.data.map(r => ({
              label: r[props.replaceFieldsLable],
              value: r.id
            }))
            state.data = data
            state.fetching = false
          } else {
            state.data = []
            state.fetching = false
          }
        })
      }
    }
    const state = reactive({
      data: [],
      values: undefined,
      fetching: false
    })

    const load = () => {
      if (props.value && props.mode === 'combobox' && props.value.id) {
        state.values = {
          value: props.value.id,
          label: props.value[props.replaceFieldsLable]
        }
        state.data = [
          {
            label: props.value[props.replaceFieldsLable],
            value: props.value.id
          }
        ]
      }
      if (props.value && props.mode !== 'combobox' && props.value.length > 0) {
        let data = props.value.map(rs => ({
          value: rs.id,
          label: rs[props.replaceFieldsLable]
        }))
        state.values = data
        state.data = data
      }
    }

    onMounted(() => {
      load()
    })

    const onSearch = value => {
      query(value)
    }
    const onFocus = () => {
      query('')
    }
    const onChange = () => {
      if (props.mode === 'combobox') {
        const data = {
          id: state.values.value,
          [props.optionField]: state.values.label
        }
        emit('update:value', data)
        emit('achange', data)
      } else {
        const data = state.values.map(rs => ({
          id: rs.value,
          [props.optionField]: rs.label
        }))
        emit('update:value', data)
        emit('achange', data)
      }
    }

    watch(
      () => props.value,
      val => {
        if (!val) {
          state.values = null
        } else {
          load()
        }
      }
    )

    return {
      ...toRefs(state),
      onSearch,
      onChange,
      onFocus
    }
  },
  props: {
    // 按钮文本、标题
    title: {
      type: String,
      default: '展开'
    },
    value: {
      type: Array || Object
    },
    storeModel: {
      type: String,
      default: 'User',
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 获取的条数
    limit: {
      type: [String, Number],
      default: 10
    },
    // 选项的来自于哪个字段
    optionField: {
      type: String,
      default: 'type'
    },
    // 如果是数组对象则需要传入该属性，获取对象的哪一个字段
    replaceFieldsLable: {
      type: String,
      default: 'name'
    },
    // 传入该属性则开启搜索功能
    searchField: {
      type: String,
      default: ''
    },
    mode: {
      // 设置 Select 的模式为多选或标签
      type: String, // combobox、multiple
      default: 'multiple'
    },
    params: {
      // 附带的查询参数，如果设置，那么获取选项列表时，会作为查询的参数
      type: Object,
      default: () => ({})
    }
  }
})
</script>
<style lang="less" scoped></style>
