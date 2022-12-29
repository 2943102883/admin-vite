<template>
  <a-card
    title="图片库"
    size="small"
    :body-style="{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }"
  >
    <slot name="title" />
    <a-upload
      v-model:file-list="fileList"
      :accept="accept"
      :multiple="multiple"
      :custom-request="customUpload"
      list-type="picture-card"
      class="upload-list-inline"
      :remove="deleteFile"
      @preview="handlePreview"
    >
      <div>
        <plus-outlined />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-empty v-show="fileList.length === 0" />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, ref, toRaw } from 'vue'
import { mapActions, useStore } from 'vuex'
import { fileUrl } from '@/store/module/file/api'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = error => reject(error)
  })
}
export default defineComponent({
  props: {
    accept: {
      type: String
    },
    module: {
      type: String,
      required: true
    },
    moduleId: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const previewVisible = ref(false)
    const previewImage = ref('')
    const fileList = ref([])
    const handleCancel = () => {
      previewVisible.value = false
    }

    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }

      previewImage.value = file.url || file.preview
      previewVisible.value = true
    }
    const $store = useStore()
    const handle = {
      $store,
      ...mapActions('File', ['create', 'queryModule', 'delete'])
    }
    const customUpload = data => {
      const formData = new FormData()
      formData.append('file', data.file)
      handle
        .create({
          module: props.module,
          moduleId: props.moduleId,
          data: formData
        })
        .then(res => {
          if (res) {
            console.log(11)
            const fileLength = fileList.value.length
            fileList.value.splice(fileLength - 1, 1)
            fileList.value.push({
              ...res,
              name: res.filename,
              thumbUrl: fileUrl({ id: res._id }),
              url: fileUrl({ id: res._id })
            })
          }
        })
    }
    const queryFileList = () => {
      handle
        .queryModule({
          module: props.module,
          moduleId: props.moduleId
        })
        .then(res => {
          console.log(res)
          res.data.forEach(val => {
            const item = {
              ...val,
              name: val.filename,
              thumbUrl: fileUrl({ id: val._id }),
              url: fileUrl({ id: val._id })
            }
            fileList.value.push(item)
          })
        })
    }
    const deleteFile = file => {
      const item = toRaw(file)
      console.log(item)
      handle.delete(item._id).then(res => {
        console.log(res)
      })
    }
    onMounted(() => {
      queryFileList()
    })
    return {
      previewVisible,
      previewImage,
      fileList,
      handleCancel,
      handlePreview,
      customUpload,
      deleteFile
    }
  }
})
</script>

<style scoped>
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 60px;
  height: 60px;
  margin-right: 8px;
}
:deep(.ant-upload-list-picture-card-container) {
  width: 60px;
  height: 60px;
}
.upload-list-inline :deep(.ant-upload-select) {
  float: left;
  width: 60px;
  height: 60px;
  margin-right: 8px;
}
</style>
