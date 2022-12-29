<template>
  <a-card
    size="small"
    title="附件"
    :body-style="{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }"
  >
    <slot name="title" />
    <a-upload
      v-model:file-list="fileList"
      :accept="accept"
      :multiple="multiple"
      :custom-request="customUpload"
      class="upload-list-inline"
      :remove="deleteFile"
      :show-upload-list="{
        showRemoveIcon: true,
        showDownloadIcon: true,
      }"
      @download="previewFile"
    >
      <a-button>
        <upload-outlined />
        上传
      </a-button>
    </a-upload>
    <a-empty v-show="fileList.length === 0" />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, ref, toRaw } from 'vue'
import { mapActions, useStore } from 'vuex'
import { fileUrl } from '../../store/file/api'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    accept: {
      type: String,
    },
    module: {
      type: String,
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    'file-list': {
      type: Object || Array,
    },
  },
  setup(props, { emit }) {
    const fileList = ref([])
    const $store = useStore()
    const handle = {
      $store,
      ...mapActions('File', [
        'create',
        'queryModule',
        'delete',
        'downloadFile',
      ]),
    }
    const customUpload = (data) => {
      const formData = new FormData()
      formData.append('file', data.file)
      handle
        .create({
          module: props.module,
          moduleId: props.moduleId,
          data: formData,
        })
        .then((res) => {
          if (res) {
            console.log(11)
            const fileLength = fileList.value.length
            fileList.value.splice(fileLength - 1, 1)
            fileList.value.push({
              uid: res.id,
              _id: res.id,
              status: 'done',
              downloadUrl: fileUrl({ id: res._id }),
              name: res.name,
              type: res.contentType,
              metadata: res.metadata,
            })
            emit('update:file-list', fileList.value)
          }
        })
    }
    const queryFileList = () => {
      handle
        .queryModule({
          module: props.module,
          moduleId: props.moduleId,
        })
        .then((res) => {
          console.log(res)
          const data = res.data.map((val) => ({
            uid: val.id,
            _id: val._id,
            status: 'done',
            downloadUrl: fileUrl({ id: val._id }),
            name: val.filename,
            type: val.metadata.contentType,
            metadata: val.metadata,
          }))
          fileList.value = [...data]
          emit('update:file-list', fileList.value)
        })
    }
    const deleteFile = (file) => {
      const item = toRaw(file)
      console.log(item)
      handle.delete(item._id).then((res) => {
        console.log(res)
        emit('delete')
        setTimeout(() => {
          emit('update:file-list', fileList.value)
        }, 100)
      })
    }
    const previewFile = (file) => {
      const item = toRaw(file)
      handle.downloadFile(item._id).then((response) => {
        if (!response) {
          message.error('资源为空，不可下载')
          return
        }
        const url = window.URL.createObjectURL(new Blob([response]))
        var elink = document.createElement('a')
        elink.download = item.name
        elink.style.display = 'none'
        elink.href = url
        elink.click()
      })
    }
    const fileProgress = (event, file, fileList) => {
      console.log('文件上传时参数==>', event, file, fileList)
    }
    onMounted(() => {
      queryFileList()
    })
    return {
      fileList,
      customUpload,
      deleteFile,
      previewFile,
      fileProgress,
    }
  },
})
</script>

<style scoped>
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 100px;
  margin-right: 8px;
}
</style>
