<template>
  <div class="selector">
    <d-search-select
      class="selector-search"
      module="User"
      action="query"
      v-model:value="selected"
      :labelInValue="true"
      @change="change"
    ></d-search-select>
    <div class="selector-btn">
      <a-button @click="add">
        <template #icon>
          <PlusSquareOutlined />
        </template>
      </a-button>
      <a-button @click="reset">
        <template #icon>
          <UndoOutlined />
        </template>
      </a-button>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selected = ref([])
    const result = ref([])
    const change = (v) => {


    }
    // 重置缓存
    const reset = () => {
      selected.value = []
    }

    //添加到缓存
    const add = () => {
      for (let i = 0; i < selected.value.length; i++) {
        console.log(selected.value[i])
        result.value.push({
          id: selected.value[i].value,
          name: selected.value[i].label
        })
      }
      console.log(result.value)
      reset()
    }
    // 清除缓存
    const clear = () => {
      result.value = []
    }
    return {
      selected,
      result,
      change,
      add,
      reset,
      clear
    }

  },
  props: {
    value: {
      type: Array,
      required: true
    }
  }
})
</script>
<style lang="less"  scoped>
.selector {
  display: flex;
  .selector-search {
    flex-grow: 1;
  }
  .selector-btn {
    flex-grow: 0;
  }
}
</style>
    