<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default {
  setup() {
    // :locale="locale"
    // console.log('locale', zhCN)
    return {
      locale: zhCN
    }
  }
}
</script>

<style lang="less"></style>
