<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    @cancel="handleCancel"
    @ok="confirm"
    :footer="footer?undefined:null"
  >
    <slot> 
      <a-breadcrumb style="border-bottom: 1px solid #eee; padding-bottom: 8px">
        <a-breadcrumb-item>上级:</a-breadcrumb-item>
        <a-breadcrumb-item v-for="item in parents" :key="item.id">{{item.name}}</a-breadcrumb-item>
      </a-breadcrumb>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        style="margin-top: 16px"
      >
        <a-form-item label="编码" name="code">
          <a-input
            v-model:value="formState.code"
            placeholder="请输入英文数字编码"
          />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="说明" name="description">
          <a-textarea v-model:value="formState.description" placeholder="请输入说明" />
        </a-form-item>
      </a-form>
    </slot>
    <template #footer>
      <a-alert v-if="error" type="warning" :message="errorMessage" />
      <a-button @click="handleCancel" key="back" type="default">{{
        cancelText
      }}</a-button>
      <a-button
        type="primary"
        key="submit"
        @click="ok"
        :loading="processing"
        :disabled="processing"
        >{{ confirmText }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
const rules = {
  name: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 3, message: "Length should be ", trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入编码", trigger: "blur" }],
};
import { defineComponent, ref,reactive,toRefs} from 'vue';
export default defineComponent({
  setup(props, context) {
    const visible = ref(false);
    const state = reactive({
      formState:{
        name: props.value?props.value.name:'',
        code: props.value?props.value.code:'',
        description: props.value?props.value.description:'',
      }
    });
    const formRef=ref()
    const handleCancel = () => {
      // visible.value = false
      context.emit("update:visible", false)
    }

    const ok = () => {
      formRef.value.validate().then(()=>{
        const data={...state.formState}
        context.emit("confirm", data)
        state.formState.name=''
        state.formState.code=''
        state.formState.description=''
      })
    }
    
    
    // const confirm = e => {
    // }
    return {
      visible,
      handleCancel,
      confirm,
      ok,

      //
      rules,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      ...toRefs(state),
      formRef,
    }

  },
  props: {
    title: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    fullscreen: {
      type: Boolean
    },
    color: {
      type: String
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ""
    },
    processing: {
      type: Boolean
    },
    value: {
      type: Object,
    },
    footer:{
      type:Boolean,
      default:true
    },
    parents:{
      type:Array,
      required:true
    }
  },


})
</script>

<style scoped>
</style>