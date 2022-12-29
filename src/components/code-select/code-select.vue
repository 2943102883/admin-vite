<template>
  <a-select
    v-model:value="selectValue"
    :options="options"
    @change="handleChange"
    :mode="mode"
    :placeholder="placeholder"
  ></a-select>
</template>
<script>
import { ref } from 'vue'
import { mapActions, useStore } from 'vuex'
export default {
  setup(props, context) {
    const options = ref([])
    const $store = useStore()

    const handler = {
      $store,
      ...mapActions('Code', ['select'])
    }
    const selectValue = ref(null)
    selectValue.value = props.value
    const loadOpt = () => {
      handler
        .select({ key: props.codeKey })
        .then(res => {
          options.value = res.code.map(item => {
            if (item.value == props.value) {
              selectValue.value = item.value
            }

            return {
              label: item.label,
              value: item.value,
              key: item.value
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    loadOpt()
    const handleChange = val => {
      console.log(val)
      context.emit('update:value', val)
      context.emit('change', val)
    }
    return {
      options,
      handleChange,
      selectValue
    }
  },
  props: {
    codeKey: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      required: true
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
      default: 'default'
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  }
}
</script>

<style scoped></style>
