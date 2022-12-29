<!-- 
* @FileDescription: 回复评论组件
* @Author: MaiTingCong
* @Date:   2019-04-10 15:24:31
* @Last Modified by:   MaiTingCong
-->
<template>
  <div>
    <a-list
      v-if="comments.length"
      :data-source="comments"
      :header="`${comments.length} ${
        comments.length > 1 ? 'replies' : 'reply'
      }`"
      item-layout="horizontal"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment
            :author="item.user.name"
            :avatar="item.avatar"
            :content="item.content"
            :datetime="item.createTime"
          />
        </a-list-item>
      </template>
    </a-list>
    <a-comment>
      <template #avatar>
        <a-avatar :src="userAvatarSrc" :alt="user.name" />
      </template>
      <template #content>
        <a-form-item>
          <a-textarea :rows="4" v-model:value="value" />
        </a-form-item>
        <a-form-item>
          <a-button
            html-type="submit"
            :loading="submitting"
            type="primary"
            @click="handleSubmit"
            >添加</a-button
          >
        </a-form-item>
      </template>
    </a-comment>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { mapActions, useStore } from 'vuex'
import { userAvatar } from '@/store/modules/user/api'

export default defineComponent({
  setup(props) {
    const $store = useStore()
    const user = reactive()
    const handler = {
      $store,
      ...mapActions('Note', ['query', 'create']),
      ...mapActions('User', ['self'])
    }

    // get current user
    handler.self().then(res => {
      user.value = res
    })

    const userAvatarSrc = computed(() => {
      return userAvatar(user.value.loginID)
    })
    const comments = ref([])
    const submitting = ref(false)
    const loading = ref(false)
    const value = ref('')

    // load data
    const load = () => {
      let module = props.module
      let moduleID = props.moduleID
      let params = {
        l: 10,
        s: '-createTime'
      }
      loading.value = true
      handler
        .query({ module, moduleID, params })
        .then(res => {
          if (res.data === null) {
            loading.value = false
            return
          }
          // 生成头像url
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].avatar = userAvatar(res.data[i].user.id)
          }
          comments.value = res.data
          loading.value = false
        })
        .catch(err => {
          console.error(err)
          loading.value = false
        })
    }

    // 提交内容
    const handleSubmit = () => {
      if (!value.value) {
        return
      }
      submitting.value = true
      let data = { content: value.value }
      handler
        .create({ module, moduleID, data })
        .then(res => {
          submitting.value = false
          // 创建成功，刷新
          load()
        })
        .catch(err => {
          submitting.value = false
        })
    }
    load()
    return {
      comments,
      submitting,
      loading,
      user,
      value,
      load,
      userAvatarSrc,
      handleSubmit
    }
  },
  props: {
    module: {
      type: String,
      required: true
    },
    moduleID: {
      type: String,
      required: true
    }
  }
})
</script>
