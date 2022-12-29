<template>
  <a-upload
    name="file"
    class="cursor-pointer"
    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    :show-upload-list="false"
    :customRequest="customUpload"
    @change="handleChange"
    @click.prevent
    :disabled="loading || disabled"
  >
    <a-button :loading="loading" :disabled="disabled">
      <ImportOutlined></ImportOutlined>
      导入
    </a-button>
  </a-upload>
</template>
<script>
import { defineComponent, ref, createVNode } from 'vue'
import { mapActions, useStore } from 'vuex'
import { message, Modal } from 'ant-design-vue'
import {
  ImportOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
export default defineComponent({
  components: { ImportOutlined },
  setup(props, { emit }) {
    const $store = useStore()
    const handle = {
      $store,
      ...mapActions(props.storeModel, ['ImportExcelCsv', 'ImportExcelXlsx']),
    }

    const loading = ref(false)

    // handleChange is called when the file input changes
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        loading.value = true
      }
      if (info.file.status === 'done') {
        loading.value = false
        emit('change', info)
      }
      if (info.file.status === 'error') {
        loading.value = false
        message.error('上传失败')
      }
    }

    const csvFileType = ['text/csv']
    const xlxFileType = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // 'application/vnd.ms-excel',
    ]

    const customUpload = (data) => {
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要导入数据吗?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: () => {
          const formData = new FormData()
          Object.keys(props.params).map((key) => {
            formData.append(key, props.params[key])
          })

          formData.append('file', data.file)
          loading.value = true
          let fileType = data.file.type

          if (csvFileType.includes(fileType)) {
            ImportExcelCsv(formData)
          }

          if (xlxFileType.includes(fileType)) {
            ImportExcelXlsx(formData)
          }
        },
      })
    }

    const ImportExcelCsv = (formData) => {
      handle
        .ImportExcelCsv({
          data: formData,
        })
        .then((res) => {
          message.success('导入成功')
          emit('changeUpdateCallBlack', res)
          loading.value = false
        })
        .catch(() => {
          loading.value = false
        })
    }
    const ImportExcelXlsx = (formData) => {
      handle
        .ImportExcelXlsx({
          data: formData,
        })
        .then((res) => {
          message.success('导入成功')
          emit('changeUpdateCallBlack', res)
          loading.value = false
        })
        .catch((err) => {
          message.error(err.response.data.msg)
          loading.value = false
        })
    }

    return {
      handleChange,
      loading,
      customUpload,
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    storeModel: {
      type: String,
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
