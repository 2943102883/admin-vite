<template>
  <div width="100%" style="background: #ececec; margin:-24px; padding:24px 24px; ">
    <!-- 详细页头部 ,包含标题和子标题-->
    <a-page-header
      v-if="title"
      :title="title"
      :sub-title="subtitle"
      :avatar="{
        src: avatar,
      }"
    >
      <template v-slot:tags>
        <slot name="tags">
          <template v-for="(tag, idx) in tags" :key="idx">
            <a-tag color="blue">{{ tag }}</a-tag>
          </template>
        </slot>
      </template>
      <!-- 扩展按钮和操作区 -->
      <template v-slot:extra>
        <slot name="extra"></slot>
      </template>
      <!-- 头部的扩展内容 -->
      <slot name="description"></slot>
    </a-page-header>
    <!-- 统计数值板块 -->
    <a-list :grid="{ gutter: gutter, column: col }" :data-source="statistic">
      <template #renderItem="{ item }">
        <a-list-item>
        <a-card>
          <a-statistic
            :title="item.title"
            :value="item.value"
            :precision="item.precision"
            :value-style="{color:item.color}"
            :suffix="item.suffix"
            :prefix="item.prefix"
          ></a-statistic>
          <template #prefix v-if="slot.prefix">
            <slot name="prefix" v-bind:item="item"></slot>
          </template>
          <template #surfix v-if="slot.suffix">
            <slot name="suffix" v-bind:item="item"></slot>
          </template>
        </a-card>
        </a-list-item>
      </template>
    </a-list>
    <div>
      <!-- 图表插槽 -->
      <slot name="charts"></slot>
    </div>
    <div>
      <!-- 内容插槽 -->
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
/**
每个item的属性:
{
    title: '标题',
    value: '20.20', //数值
    precision:2 , // 数值精度
    color: '#cf1322', //颜色
    suffix: '%' , //后缀单位
    prefix : '增加' //前缀内容
}
 */
export default {
  setup(props, context) {
    const slot = {
      prefix: context.slots.prefix ? true : false,
      suffix: context.slots.suffix ? true : false

    }
    return {
      slot
    }

  },
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    avatar: {
      type: String
    },
    tags: {
      type: Array
    },
    gutter: {
      type: Number,
      default: 16
    },
    col: {
      type: Number,
      default: 4
    },
    statistic: {
      type: Array,
      default: []
    }
  }
}
</script>