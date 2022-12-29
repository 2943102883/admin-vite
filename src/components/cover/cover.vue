<template>
  <div
    class="d-flex justify-center avatar relative overflow-hidden"
    :class="['rounded-' + radius]"
  >
    <a-image
      ref="imgRef"
      class="h-full w-full"
      :fallback="errorImg"
      :preview="preview"
      alt="example"
      :src="imageUrl"
      @click.prevent
      :style="{ opacity: preview ? 0 : 1 }"
    />

    <div
      v-if="preview"
      class="bgimg h-full w-full absolute inset-0"
      :style="{ backgroundImage: `url(${imageUrl})` }"
    ></div>

    <div class="btns" v-if="rowAction">
      <a-upload
        name="file"
        class="cursor-pointer"
        :show-upload-list="false"
        :customRequest="customUpload"
        @change="handleChange"
        @click.prevent
      >
        <EditOutlined :style="{ fontSize: '18px', color: '#1890ff' }" />
      </a-upload>

      <span class="BT"></span>
      <DeleteOutlined
        :style="{ fontSize: '18px', color: '#ff4949' }"
        @click.stop="onDelete"
      />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
  watchEffect,
} from 'vue'
import { mapActions, useStore } from 'vuex'
import { message } from 'ant-design-vue'

/**
 * errorImg: 默认图片
 */
const errorImg = `data
:image/png;base64,iVBORw0KGgoAA
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`

/**
 * getBase64 returns the base64 encoded string of the given image
 * @param {string} file - the image file path
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })
}

export default defineComponent({
  setup(props, { emit }) {
    const app = getCurrentInstance()
    const baseUrl = app.appContext.config.globalProperties.$baseUrl
    const $store = useStore()
    const handle = {
      $store,
      ...mapActions('AtomArticle', ['createImg', 'deleteImg']),
    }

    const loading = ref(false)
    const preview = ref(false)
    const imageUrl = ref()
    const imgRef = ref()

    const getImgSrc = (id, name, size) => {
      return encodeURI(`${baseUrl}/file/pub/img/${id}/${name}?size=${size}`)
    }

    onMounted(() => {
      if (props.imgInfo && props.imgInfo.id && props.imgInfo.name) {
        imageUrl.value = getImgSrc(props.imgInfo.id, props.imgInfo.name, 'big')
        preview.value = true
      } else {
        imageUrl.value = errorImg
        preview.value = false
      }
    })

    watchEffect(() => {
      if (props.imgInfo && props.imgInfo.id && props.imgInfo.name) {
        imageUrl.value = getImgSrc(props.imgInfo.id, props.imgInfo.name, 'big')
        preview.value = true
      } else {
        imageUrl.value = errorImg
        preview.value = false
      }
    })

    // handleChange is called when the file input changes
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        loading.value = true
      }
      if (info.file.status === 'done') {
        emit('change', info)
      }
      if (info.file.status === 'error') {
        loading.value = false
        .error('图片上传失败')
      }
    }

    const onDelete = () => {
      if (props.imgInfo && props.imgInfo.id) {
        handle.deleteImg({ id: props.imgInfo.id }).then((res) => {
          setTimeout(() => {
            emit('change', 'del')
          }, 100)
        })
      }
    }

    const customUpload = (data) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('module', props.module)
      formData.append('moduleId', props.moduleId)
      handle
        .createImg({
          data: formData,
        })
        .then((res) => {
          message.success('图片上传成功')
          console.log('res', res)
          emit('change', res)
        })
    }

    return {
      imageUrl,
      handleChange,
      loading,
      onDelete,
      errorImg,
      imgRef,
      preview,
      customUpload,
    }
  },
  props: {
    imgInfo: {
      type: [Object],
      required: true,
    },

    module: {
      type: String,
      // required: true,
    },
    moduleId: {
      type: String,
      // required: true,
    },

    radius: {
      type: String, //circle、sm、xl、lg
      default: 'lg',
    },

    rowAction: {
      Boolean: Boolean,
      default: true,
    },
  },
})
</script>
<style lang="less" scoped>
.bgimg {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.avatar:hover .btns {
  display: flex;
}

.ant-upload-select-picture-card .ant-upload-text {
  color: #666;
}

:deep(.ant-upload-picture-card-wrapper) {
  width: 100%;
}
:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  background-color: transparent;
}
:deep(.ant-upload-list-item) {
  padding: 0 !important;
  position: absolute;
  max-width: 102px;
  max-height: 102px;
}
:deep(.ant-upload.ant-upload-select-picture-card > .ant-upload) {
  padding: 0;
}
:deep(.ant-image) {
  position: absolute;
  width: 100%;
  height: 100%;
  // opacity: 0;
  z-index: 2;
  overflow: hidden;
  text-align: center;
}
.upload-btn {
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  text-align: center;
  vertical-align: middle;
}
.delete-btn {
  display: none;
  position: absolute;
  z-index: 99;
  top: 0px;
  right: 20px;
  text-align: center;
  vertical-align: middle;
}
.btns {
  position: absolute;
  bottom: 0;
  z-index: 10;
  display: none;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: #d7d7d7cf;
}
.BT {
  width: 1px;
  height: 100%;
  display: inline-block;
  background-color: #e6e2e2;
}

.rounded-lg {
  border-radius: 8px !important;
}
.rounded-xl {
  border-radius: 24px !important;
}
.rounded-sm {
  border-radius: 24px !important;
}
.rounded-circle {
  border-radius: 50% !important;
}
.d-flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
</style>
