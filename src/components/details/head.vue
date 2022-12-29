<template>
  <div class="head">
    <div class="navigateBack">
      <slot name="avatar" />
    </div>
    <div class="title">
      <!-- <slot name="avatar"> </slot> -->
      <h3 class="title">
        <slot name="title" />
      </h3>
      <h5 class="subtitle">
        <slot name="subtitle" />
      </h5>

      <slot name="tags" />
    </div>

    <p class="des">
      <slot name="des" />
    </p>
  </div>
</template>

<script>
export default {
  props: {},
  setup() {
    return {}
  },
}
</script>

<style scoped>
.head {
  padding: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #ffffff;
  margin-bottom: 8px;
  height: 48px;
}
.navigateBack {
  color: #000;
  font-size: 16px;
  cursor: pointer;
}
:deep(.navigateBack > .anticon) {
  font-size: 26px;
  margin-right: 10px;
}
/* :deep(.anticon > svg) {
  width: 25px;
  height: 25px;
} */
.subtitle {
  color: #999;
}
p {
  margin-top: 0;
  margin-bottom: 0;
}
.title {
  color: black;
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.title > * {
  margin: 0;
  margin-right: 6px;
}
.des {
  color: black;
  font-size: 14px;
}
@media print {
  :deep(.head) {
    display: none;
  }
}
</style>
