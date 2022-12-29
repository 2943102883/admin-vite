<template>
  <download-excel
    :fields="fields"
    :name="`${tableName}.xls`"
    type="csv"
    :data="excelData"
    ref="excelDownLoad"
    :disabled="disabled"
  >
    <a-button
      :loading="loading"
      @click.stop="getTableData"
      :type="type"
      :disabled="disabled"
    >
      <ExportOutlined />
      {{ title }}
    </a-button>
  </download-excel>
</template>
<script>
import {
  defineComponent,
  ref,
  createVNode,
  onMounted,
  nextTick,
  toRaw,
} from 'vue'
import { mapActions, useStore } from 'vuex'
import { message, Modal } from 'ant-design-vue'
import {
  ExportOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import downloadExcel from 'vue-json-excel3'
export default defineComponent({
  components: { ExportOutlined, downloadExcel },
  setup(props) {
    const $store = useStore()
    const excelData = ref([])
    const fields = ref([])
    const excelDownLoad = ref(null)

    const handle = {
      $store,
      ...mapActions(props.storeModel, ['query']),
    }

    const loading = ref(false)
    const getTableData = () => {
      loading.value = true
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要导出数据吗?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: async () => {
          if (props.data && props.data.length) {
            excelData.value = toRaw(props.data)
            nextTick(() => {
              excelDownLoad.value.generate()
            })
          } else {
            let newParams = Object.assign({}, { s: 0, o: '-_id' }, props.params)
            fields.value = props.tableFields
            let res = await handle.query(newParams)
            if (res.data && res.data.length) {
              excelData.value = res.data
              nextTick(() => {
                excelDownLoad.value.generate()
              })
            } else {
              excelData.value = []
              message.success('没有数据')
            }
          }

          loading.value = false
        },
        onCancel: () => {
          loading.value = false
        },
      })
    }

    const loadTable = async () => {
      loading.value = true
      let excelData = []
      let newParams = Object.assign({}, { s: 0, o: '-_id' }, props.params)
      fields.value = props.tableFields
      let res = await handle.query(newParams)
      if (res.data && res.data.length) {
        excelData = res.data
      } else {
        excelData = []
      }
      loading.value = false

      return excelData
    }

    return {
      loading,
      excelData,
      fields,
      getTableData,
      loadTable,
      excelDownLoad,
    }
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '导出',
    },
    storeModel: {
      type: String,
      required: true,
    },
    tableName: {
      type: String,
      default: '表格',
    },
    params: {
      type: Object,
      default: () => {},
    },
    tableFields: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style lang="less" scoped></style>
