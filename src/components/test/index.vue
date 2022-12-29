<template>
  <p class="text-red-600">{{ title }}</p>
</template>
<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String
    }
  },

  setup(props, context) {
    return {}
  }
})
</script>

<style scoped></style>
