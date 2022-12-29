<template>
  <div class="d-curd-toolbar">
    <div class="d-curd-toolbar-filters flex items-center">
      <a-space>
        <slot name="filtersbtns" v-bind:param="param"></slot>
        <slot name="filters" v-bind:param="param"> </slot>
        <slot name="keyword">
          <a-space>
            <a-input-search
              v-if="toolbarKeyWord"
              v-model:value="keyword"
              placeholder="关键词查询"
              style="width: 200px"
              :loading="loading"
              @search="handleSearch"
              allowClear
            >
              <template #enterButton>
                <a-button>
                  <SearchOutlined />
                </a-button>
              </template>
            </a-input-search>
            <a-button
              v-if="!toolbarKeyWord"
              @click="load"
              :disabled="loading"
              type="primary"
            >
              <SearchOutlined />
            </a-button>
            <a-button
              v-if="toolbarKeyWord"
              @click="load"
              :disabled="loading"
              type="link"
              class="flex items-center"
            >
              <template #icon
                ><SyncOutlined
                  :style="{ fontSize: '22px', lineHeight: '22px' }"
              /></template>
            </a-button>
          </a-space>
        </slot>
      </a-space>

      <a-space>
        <slot name="rightbtns" v-bind:param="param"></slot>
        <span>
          <a-button v-if="resetBtn" type="link" @click="reset"
            >重置搜索</a-button
          >
        </span>
      </a-space>
    </div>
  </div>
</template>
<script>
import { toRaw } from 'vue'
export default {
  setup(props, context) {
    const handleSearch = () => {
      context.emit('search', { ...toRaw(props.param), k: props.keyword })
    }
    const create = () => {
      context.emit('create')
    }
    const load = () => {
      context.emit('load')
    }
    const reset = () => {
      context.emit('reset')
    }
    return {
      //   params,
      handleSearch,
      create,
      load,
      reset
    }
  },
  props: {
    keyword: {
      type: String
    },
    toolbarKeyWord: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean
    },
    param: {
      type: Object
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    resetBtn: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="less" scoped>
.d-curd-toolbar {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: tnum;
  position: relative;
  padding: 8px;
  background-color: #f5f5f5;
}

.d-curd-toolbar-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
}
.d-curd-toolbar-curdBtns {
  display: block;
  float: right;
}
.d-curd-toolbar-control {
  float: right;
}
</style>
