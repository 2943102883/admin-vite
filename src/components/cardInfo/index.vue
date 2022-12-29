<template>
  <a-card
    class="relative !p-2 !text-[0px] min-h-[200px]"
    :loading="form.loading"
  >
    <a-space align="start" :size="16" class="w-full flex h-full text-[14px]">
      <div v-if="form.left">
        <slot name="left" v-bind:entity="form.formData" />
      </div>
      <div v-if="form.right">
        <slot name="right" v-bind:entity="form.formData" />
      </div>
    </a-space>
    <!-- <a-button
      type="link"
      @click="show"
      class="!absolute top-0 right-0"
      v-auth:edit="route"
      v-if="form.slotsEdit"
    >
      <FormOutlined class="text-lg" />
    </a-button> -->

    <dialog-active
      ref="dialogRef"
      v-if="form.slotsEdit"
      v-model:visible="form.visible"
      v-model:processing="form.processing"
      :error="form.error"
      :width="dialogWidth"
      :errorMessage="form.errorMessage"
      @confirm="submitEdit"
      title="编辑"
      :footer="formFooter"
    >
      <slot
        name="editForm"
        :entity="form.entity"
        v-bind:formRef="formRef"
        v-bind:dialogRef="dialogRef"
        >没有定义表单...</slot
      >
    </dialog-active>
  </a-card>
</template>
<script>
import { onMounted, reactive, watch, ref, defineComponent } from 'vue'
import { mapActions, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  props: {
    id: {
      type: String,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    dialogWidth: {
      type: [String, Number],
      default: 480
    },
    formFooter: {
      type: Boolean,
      default: true
    },
    storeModel: {
      type: [String, Object]
      // required: true
    }
  },
  setup(props, context) {
    const $store = useStore()
    const route = useRoute()
    const formRef = ref(null)
    const dialogRef = ref(null)

    const handler = {
      // 映射到store的方法
      $store,
      ...mapActions(props.storeModel, ['update', 'one'])
    }

    const formEditRef = ref()

    const form = reactive({
      formData: {},
      editRef: null,
      entity: {},
      visible: false,
      processing: false,
      error: false,
      errorMessage: '',
      loading: true,
      slotsEdit: context.slots.editForm ? true : false,
      left: context.slots.left ? true : false,
      right: context.slots.right ? true : false
    })

    const show = () => {
      form.visible = true
      form.entity = {
        ...form.formData
      }
    }

    // 提交编辑
    const submitEdit = () => {
      formRef.value
        .validate()
        .then(() => {
          form.processing = true
          handler
            .update({
              data: form.entity
            })
            .then(res => {
              form.processing = false
              form.visible = false
              form.formData = res
              context.emit('load', res)
            })
            .catch(error => {
              if (error.response.data) {
                form.errorMessage = error.response.data.msg
              } else {
                form.errorMessage = '保存时出现了异常，暂时无法保存。'
              }
              form.error = true
              form.processing = false
            })
        })
        .catch(error => {
          console.log('error:', error)
        })
    }

    const getOne = () => {
      if (!props.id) return
      handler
        .one({
          id: props.id
        })
        .then(res => {
          form.processing = false
          form.modal = false
          form.formData = res
          form.loading = false
          context.emit('load', res)
        })
        .catch(error => {
          if (error.response.data) {
            form.errorMessage = error.response.data.msg
          } else {
            form.errorMessage = '保存时出现了异常，暂时无法保存。'
          }
          form.error = true
          form.processing = false
          form.loading = false
        })
    }

    onMounted(() => {
      getOne()
    })

    watch(
      () => props.id,
      id => {
        if (id) {
          getOne()
        }
      }
    )

    return {
      form,
      formRef,
      dialogRef,
      route,
      show,
      submitEdit
    }
  }
})
</script>
<style lang="less" scoped>
:deep(.ant-card-body) {
  padding: 0px;
}
</style>
