<template>
  <a-card
    size="small"
    title="附件"
    :bodyStyle="{
      padding: '2px',
      height: '260px',
      overflowY: 'auto',
      position: 'relative',
    }"
  >
    <slot name="title"></slot>
    <template #extra>
      <a-upload
        v-if="menu"
        :accept="accept"
        :multiple="multiple"
        :customRequest="customUpload"
        :showUploadList="false"
      >
        <a-button type="primary" size="small" :loading="loading">
          <upload-outlined v-if="!loading"></upload-outlined>
          上传
        </a-button>
      </a-upload>
    </template>

    <div
      v-if="fileList.length && fileType == 'img'"
      class="grid grid-cols-3 gap-2"
    >
      <div
        class="m-1 p-2 bg-gray-100 flex justify-center items-center"
        v-for="imgItem in fileList"
        :key="imgItem._id"
      >
        <a-dropdown :trigger="['contextmenu']" :disabled="!menu">
          <a class="ant-dropdown-link" @click.prevent>
            <a-image class="w-full" :src="getImgSrc(imgItem, null)">
              <template #placeholder>
                <a-image
                  :src="getImgSrc(imgItem, 'mini')"
                  class="w-full"
                  :preview="false"
                />
              </template>
            </a-image>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <span>{{ imgItem.filename }}</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="1">
                <a href="#" @click.prevent="deleteFile(imgItem)">删除</a>
              </a-menu-item>
              <a-menu-item key="3">
                <a href="#" @click.prevent="copyAddress(imgItem)">复制地址</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <div
      v-if="fileList.length && fileType == 'file'"
      class="grid grid-cols-3 gap-2"
    >
      <div
        class="m-1 p-2 bg-gray-100 flex justify-center items-center"
        v-for="imgItem in fileList"
        :key="imgItem._id"
      >
        <a-dropdown :trigger="['contextmenu']" :disabled="!menu">
          <a class="ant-dropdown-link" @click.prevent>
            <a-image
              width="64"
              :preview="false"
              :src="getImgSrc(imgItem, 'mini')"
              fallback="data:image/png;base64,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"
            ></a-image>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <span>{{ imgItem.filename }}</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="1">
                <a href="#" @click.prevent="deleteFile(imgItem)">删除</a>
              </a-menu-item>
              <a-menu-item key="3">
                <a href="#" @click.prevent="copyAddress(imgItem)">复制地址</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <a-empty v-show="fileList.length === 0" />
  </a-card>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  toRaw,
  getCurrentInstance,
  createVNode,
} from 'vue'
import { mapActions, useStore } from 'vuex'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import useClipboard from 'vue-clipboard3'

export default defineComponent({
  setup(props, { emit }) {
    const app = getCurrentInstance()
    const baseUrl = app.appContext.config.globalProperties.$baseUrl
    const fileList = ref([])
    const loading = ref(false)
    const $store = useStore()
    const { toClipboard } = useClipboard()
    const handle = {
      $store,
      ...mapActions('FileList', [
        'createImg',
        'createFile',
        'queryImg',
        'queryFile',
        'deleteFile',
        'deleteImg',
      ]),
    }
    const customUpload = (data) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('module', props.module)
      formData.append('moduleId', props.moduleId)

      loading.value = true
      if (props.fileType == 'img') {
        handle
          .createImg({
            data: formData,
          })
          .then((res) => {
            message.success('图片上传成功')
            loading.value = false
            queryFileList()
          })
      }

      if (props.fileType == 'file') {
        handle
          .createFile({
            data: formData,
          })
          .then((res) => {
            message.success('文件上传成功')
            loading.value = false
            queryFileList()
          })
      }
    }
    const queryFileList = () => {
      let data = { module: props.module, moduleId: props.moduleId }
      if (props.fileType == 'img') {
        handle.queryImg({ data }).then((res) => {
          if (res.data && res.data.length) {
            fileList.value = res.data
          } else {
            fileList.value = []
          }
        })
      }

      if (props.fileType == 'file') {
        handle.queryFile({ data }).then((res) => {
          if (res.data && res.data.length) {
            fileList.value = res.data
          } else {
            fileList.value = []
          }
        })
      }
    }
    const deleteFile = (file) => {
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要删除这条数据吗?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: () => {
          let item = toRaw(file)
          if (props.fileType == 'img') {
            handle.deleteImg({ id: item._id }).then((res) => {
              emit('delete')
              message.success('删除成功')
              setTimeout(() => {
                emit('update:file-list', fileList.value)
                queryFileList()
              }, 100)
            })
          }

          if (props.fileType == 'file') {
            handle.deleteFile({ id: item._id }).then((res) => {
              emit('delete')
              message.success('删除成功')
              setTimeout(() => {
                emit('update:file-list', fileList.value)
                queryFileList()
              }, 100)
            })
          }
        },
      })
    }

    const previewFile = (file) => {
      let item = toRaw(file)
      handle.downloadFile(item._id).then((response) => {
        if (!response) {
          message.error('资源为空，不可下载')
          return
        }
        let url = window.URL.createObjectURL(new Blob([response]))
        var elink = document.createElement('a')
        elink.download = item.name
        elink.style.display = 'none'
        elink.href = url
        elink.click()
      })
    }

    const getImgSrc = (imgInfo, size) => {
      if (size) {
        return encodeURI(
          `${baseUrl}/file/pub/img/${imgInfo._id}/${imgInfo.filename}?size=${size}`,
        )
      } else {
        return encodeURI(
          `${baseUrl}/file/pub/img/${imgInfo._id}/${imgInfo.filename}`,
        )
      }
    }

    const copyAddress = async (imgItem) => {
      try {
        await toClipboard(getImgSrc(imgItem))
        message.success('复制成功')
      } catch (e) {
        console.log(e)
        message.error('复制失败')
      }
    }

    onMounted(() => {
      queryFileList()
    })
    return {
      fileList,
      customUpload,
      deleteFile,
      previewFile,
      getImgSrc,
      loading,
      copyAddress,
      queryFileList,
    }
  },
  props: {
    fileType: {
      type: String,
    },
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
    menu: {
      type: Boolean,
      default: true,
    },
    'file-list': {
      type: Object || Array,
    },
  },
})
</script>

<style scoped lang="less">
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 100px;
  margin-right: 8px;
}

:deep(.ant-upload-list-picture .ant-upload-list-item) {
  border: 0px solid #d9d9d9;
  height: 100px;
  width: 100px;
}

:deep(.ant-upload-list-item-error .ant-upload-list-item-name) {
  color: #d9d9d9;
  display: none;
}

:deep(.ant-upload-list-picture
    .ant-upload-list-item-thumbnail
    img, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
  display: block;
  width: 90px;
  height: 90px;
  overflow: hidden;
}

:deep(.ant-upload-list-picture .ant-upload-list-item-thumbnail) {
  width: 90px;
  height: 90px;
}

:deep(.ant-upload-list-item-card-actions) {
  right: 30px;
}

:deep(.ant-upload-list-item-card-actions.picture) {
  top: 45px;
}

:deep(.ant-upload-list-item-error .ant-upload-list-item-card-actions .anticon) {
  color: rgba(0, 0, 0, 0.45);
}
:deep(.ant-image-img) {
  width: 64px;
}
:deep(.ant-empty) {
  margin-top: 40px;
}

:deep(.ant-dropdown-link[disabled='false']) {
  cursor: pointer;
}

:deep(.ant-dropdown-link[disabled='true']) {
  cursor: pointer;
}
</style>
