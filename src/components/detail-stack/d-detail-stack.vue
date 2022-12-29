<template>
  <div width="100%">
    <!-- 详细页头部 ,包含标题和子标题-->
    <a-page-header :title="title" :sub-title="subtitle" :avatar="{
        src: avatar,
      }">
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
    <!-- 主要内容板块 -->
    <a-card v-if="block.content">
      <slot name="content"></slot>
    </a-card>
    <!-- 第二内容板块-->
    <a-card v-if="block.second">
      <slot name="second"></slot>
    </a-card>
    <!-- 评论板块 -->
    <a-card v-if="block.comment">
      <slot name="comment"></slot>
    </a-card>
  </div>
</template>
<script>
export default {
  setup(props, context) {
    const block = {
      description: context.slots.description ? true : false,
      content: context.slots.content ? true : false,
      second: context.slots.second ? true : false,
      comment: context.slots.comment ? true : false
    }
    return {
      block
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
    value: {
      type: Object,
      require: true
    }

  }
}
</script>