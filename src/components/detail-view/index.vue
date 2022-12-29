<template>
  <div class="w-full flex-1 overflow-y-auto">
    <div class="flex gap-2">
      <a-space
        direction="vertical"
        :size="size"
        :align="align"
        v-if="left"
        class="flex-1"
      >
        <slot name="left"> </slot>
      </a-space>

      <a-space
        direction="vertical"
        :size="size"
        :align="align"
        v-if="right"
        class="w-[400px]"
      >
        <slot name="right"> </slot>
      </a-space>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    left: {
      type: Boolean,
      default: true
    },
    right: {
      type: Boolean,
      default: true
    },
    size: {
      type: [Number, String],
      default: 'small'
    },
    align: {
      type: String,
      default: ''
    }
  },
  setup(props) {}
})
</script>
