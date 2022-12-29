<template>
  <a-card size="small" class="w-full" :loading="loading || propsLoading">
    <template #title>
      <div class="flex items-center">
        <svg-icon
          local-icon="ListDetails"
          class="text-[20px] text-[#1890ff]"
        ></svg-icon>
        <span class="ml-1 text-[16px]">附件</span>
      </div>
    </template>

    <template #extra>
      <a-upload
        name="file"
        class="cursor-pointer"
        :accept="accept"
        :show-upload-list="false"
        :customRequest="customUpload"
        @change="handleChange"
        @click.prevent
      >
        <a-button size="small">
          <upload-outlined></upload-outlined>
          上传
        </a-button>
      </a-upload>
    </template>

    <a-list v-if="attachment.length" size="small" :data-source="attachment">
      <template #renderItem="{ item }">
        <a-list-item>
          <div class="w-full flex justify-between items-center">
            <span
              class="text-blue-400 cursor-pointer"
              @click="downloadFile(item)"
              >{{ item.name }}</span
            >
            <a-button type="text" danger @click="onDelete(item.id)"
              ><DeleteOutlined
            /></a-button>
          </div>
        </a-list-item>
      </template>
    </a-list>

    <div v-else class="max-h-md">
      <a-empty />
    </div>
  </a-card>
</template>

<script>
import { defineComponent, ref, onMounted, watch, createVNode } from 'vue'
import { mapActions, useStore } from 'vuex'
import { message, Modal } from 'ant-design-vue'

import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  setup(props, { emit }) {
    const $store = useStore()
    const handle = {
      $store,
      ...mapActions(props.storeModel, ['setAttachment']),
      ...mapActions('File', ['create', 'delete', 'downloadFile'])
    }
    const previewVisible = ref(true)
    const loading = ref(false)

    const handleChange = info => {
      if (info.file.status === 'uploading') {
        loading.value = true
      }
      if (info.file.status === 'done') {
        emit('change', info)
      }
      if (info.file.status === 'error') {
        loading.value = false
        message.error('图片上传失败')
      }
    }

    const setAttachment = (type, res) => {
      let data = []

      if (type == 'add') {
        data = [...props.attachment]
        data.push({
          id: res.id,
          name: res.name,
          url: ''
        })
      }

      if (type == 'del') {
        data = props.attachment.filter(row => row.id !== res)
      }

      handle.setAttachment({ id: props.id, data }).then(res => {
        message.success('更新成功')
        emit('update:attachment', data)
      })
    }

    const downloadFile = item => {
      handle.downloadFile(item.id).then(response => {
        if (!response) {
          message.error('资源为空，不可下载')
          return
        }
        const url = window.URL.createObjectURL(new Blob([response]))
        var link = document.createElement('a')
        link.download = item.name
        link.style.display = 'none'
        link.href = url
        link.click()
      })
    }

    const onDelete = id => {
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要删除数据?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: () => {
          handle.delete(id).then(() => {
            message.success('删除成功')
            setAttachment('del', id)
          })
        }
      })
    }

    const customUpload = data => {
      const formData = new FormData()
      formData.append('file', data.file)
      console.log('props.attachment', props.attachment)

      handle.create({ data: formData }).then(res => {
        if (res) {
          console.log('props.attachment', res)
          loading.value = false
          message.success('上传成功')
          emit('change', res)
          setAttachment('add', res)
        }
      })
    }

    return {
      handleChange,
      loading,
      onDelete,
      downloadFile,
      customUpload
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    storeModel: {
      type: String,
      required: true
    },
    attachment: {
      type: Array,
      default: () => {
        return []
      }
    },
    accept: {
      type: String
    },
    propsLoading: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped></style>
