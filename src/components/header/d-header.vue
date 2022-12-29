<template>
  <div class="d-curd-header">
    <div class="cc">
      <div class="d-curd-icon" v-if="icon">
        <slot name="icon">
          <svg-icon
            :local-icon="icon"
            :icon="icon"
            class="text-[32px] text-[#1890ff] cursor-pointer"
          ></svg-icon>
        </slot>
      </div>
      <div class="d-curd-title">
        <slot name="headTitle">{{ title }}</slot>
      </div>
      <div class="d-curd-subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
      <div class="d-curd-header-extra">
        <slot name="extra"></slot>
      </div>
    </div>

    <div class="d-curd-toolbar-control">
      <a-space>
        <slot name="control" :ids="ids">
          <a-button v-if="createButton" type="primary" @click="create"
            >新建</a-button
          >
        </slot>
      </a-space>
    </div>
  </div>
</template>
<script>
export default {
  setup(props, context) {
    console.log('props', props.icon)
    const create = () => {
      context.emit('create')
    }
    return {
      create
    }
  },
  props: {
    ids: {
      type: Array
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    icon: {
      type: [String, Object]
    }
  }
}
</script>
<style scoped lang="less">
.d-curd-header {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 8px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  height: 48px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: tnum;
  position: relative;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
}
.d-curd-title {
  display: block;
  float: left;
  margin-bottom: 0;
  padding-right: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
}

.d-curd-subtitle {
  float: left;
  margin: 5px 0;
  margin-right: 12px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.d-curd-header-tags {
  float: left;
  margin: 4px 0;
}
.d-curd-icon {
  float: left;
  line-height: 32px;
  font-size: 18px;
  margin-right: 8px;
}
.d-curd-header-extra {
  float: right;
}
.d-curd-toolbar-control {
  float: right;
}

.cc:after {
  content: '';
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}

@media print {
  .d-curd-header {
    display: none;
  }
}
</style>
