<template>
  <a-form-item
    v-for="row in list"
    :label="row.label"
    :name="row.key"
    :key="row.key"
    v-bind="row.validate"
  >
    <!-- <a-input
      v-if="row.valueType == 'input'"
      v-model:value.trim="formValue[row.key]"
      placeholder="请输入基地名称"
      allow-clear
      :key="row.key"
      @change="changeValue($event)"
    ></a-input> -->

    <a-input-number
      v-if="row.valueType == 'number'"
      v-model:value.trim="formValue[row.key]"
      allow-clear
      :key="row.key"
      class="!w-full"
      @change="changeVal"
    />
  </a-form-item>
</template>

<script>
import { watch, ref } from '@vue/runtime-core'

export default {
  props: {
    field: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const list = ref([])
    const formValue = ref({})
    const valueF = ref([])

    watch(
      () => [props.field, props.value],
      () => {
        formValue.value = {}

        list.value = props.field.length > 0 ? props.field : []

        valueF.value = props.field.map(row => {
          formValue.value[row.key] = undefined
          return {
            key: row.key,
            label: row.label,
            sort: row.sort,
            valueType: row.valueType,
            value: undefined
          }
        })

        if (props.value && props.value.length) {
          valueF.value = props.value
          props.value.forEach(row => {
            formValue.value[row.key] = Number(row.value) || 0
          })
        }
      },
      { deep: true, immediate: true }
    )

    const changeVal = () => {
      Object.entries(formValue.value).forEach(([key, val]) => {
        valueF.value.forEach(row => {
          if (row.key == key) {
            row.value = val + ''
          }
        })
      })
      emit('update:value', valueF)
      emit('change', valueF)
    }

    return {
      list,
      formValue,
      changeVal
    }
  }
}
</script>

<style scoped></style>
