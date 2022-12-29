<template>
  <div class="login-bg">
    <Login />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Login from '@/components/login/index.vue'
export default defineComponent({
  components: { Login },
  setup() {
    return {}
  }
})
</script>
<style lang="less" scoped>
.login-bg {
  width: 100%;
  height: 100%;
}
</style>
