<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :width="width"
    centered
    @cancel="handleCancel"
    :maskClosable="false"
    @ok="confirm"
    :footer="footer ? undefined : null"
  >
    <slot>没有定义表单...</slot>
    <template #footer>
      <a-alert v-if="error" type="warning" :message="errorMessage" />

      <a-button
        @click="handleCancel"
        key="back"
        type="default"
        :disabled="cancelButton"
      >
        {{ cancelText }}
      </a-button>

      <a-button
        type="primary"
        key="submit"
        @click="ok"
        :loading="processing"
        :disabled="okButton"
        >{{ confirmText }}</a-button
      >
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs } from "vue";
export default defineComponent({
  setup(props, context) {
    const visible = ref(false);

    const handleCancel = () => {
      context.emit("update:visible", false);
    };

    const ok = () => {
      context.emit("confirm", null);
    };

    return {
      ...toRefs(props),
      visible,
      handleCancel,
      confirm,
      ok,
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    width: {
      type: [String, Number],
      default: "500px",
    },
    height: {
      type: [String, Number],
    },
    fullscreen: {
      type: Boolean,
    },
    color: {
      type: String,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    processing: {
      type: Boolean,
    },
    okButton: {
      type: Boolean,
      default: false,
    },
    cancelButton: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style scoped></style>
