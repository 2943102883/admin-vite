<template>
  <div
    style="border: 1px solid #ccc"
    class="flex-1 flex flex-col overflow-hidden h-[400px]"
  >
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="flex-1 overflow-hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { mapActions, useStore } from 'vuex'
import { fileUrl } from '@/store/file/api'
import { message } from 'ant-design-vue'

export default {
  components: { Editor, Toolbar },
  props: {
    module: {
      type: String,
      default: 'Administer',
    },
    moduleId: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    // 内容 HTML
    const valueHtml = ref('')
    // 模拟 ajax 异步获取内容

    watch(
      () => props.value,
      (newVal) => {
        if (newVal) {
          valueHtml.value = newVal
        } else {
          valueHtml.value = ''
        }
      },
      { immediate: true, deep: true },
    )

    watch(
      () => props.disabled,
      (bool) => {
        const editor = editorRef.value
        if (editor == null) return
        if (bool) {
          editor.disable()
        } else {
          editor.enable()
        }
      },
      { immediate: true, deep: true },
    )

    const $store = useStore()
    const handle = {
      $store,
      ...mapActions('AtomArticle', ['createImg']),
    }
    const toolbarConfig = {
      excludeKeys: ['codeBlock', 'fullScreen', 'uploadVideo'],
      // insertKeys: {
      //   keys: ['save']
      // },
    }
    let editorConfig = {
      placeholder: '请输入正文',
      readOnly: props.disabled,
      MENU_CONF: {
        // 自定义上传图片
        uploadImage: {
          async customUpload(file, insertFn) {
            // file 即选中的文件
            const formData = new FormData()
            formData.append('file', file)
            formData.append('module', props.module)
            formData.append('moduleId', props.moduleId)
            let fileRes = await handle.createImg({
              data: formData,
            })

            let url = fileUrl({ id: fileRes.id, name: fileRes.name })
            let alt = fileRes.name
            let href = url
            // 自己实现上传，并得到图片 url alt href
            // 最后插入图片
            insertFn(url, alt, href)
            context.emit('updateImg')
            message.success('图片上传成功')
          },
        },
      },
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })
    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
      // console.log('ewqeqeq',editorRef.value.getAllMenuKeys());
    }
    const handleChange = (editor) => {
      context.emit('change', editor.getHtml())
      context.emit('update:value', editor.getHtml())
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
    }
  },
}
</script>
