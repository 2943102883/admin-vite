<template>
  <a-card
    size="small"
    :title="title"
    :body-style="{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }"
  >
    <template #extra><a href="#">更多</a></template>
    <a-list
      v-if="comments.length"
      :data-source="comments"
      header=""
      size="small"
      item-layout="horizontal"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment
            :content="item.content"
            :datetime="item.datetime"
            :avatar="item.avatar"
            :author="item.author"
          >
            <template #actions>
              <a-button
                v-show="item.showDel"
                type="text"
                size="small"
                style="font-size: 12px"
                @click="del(item)"
              >
                删除
              </a-button>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>
    <a-comment>
      <template #avatar>
        <a-avatar :src="userAvastr" alt="Han Solo" />
      </template>
      <template #content>
        <a-form-item>
          <a-textarea
            v-model:value="value"
            :rows="2"
            placeholder="留下评论(ctrl+Enter发送)"
            @keyup.ctrl.enter="handleSubmit"
          />
        </a-form-item>
      </template>
    </a-comment>
  </a-card>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import { userAvatar } from '@/store/modules/user/api'
import { moment } from '@/utils/filters'
import { mapActions, useStore } from 'vuex'
moment.locale('zh-cn')
export default defineComponent({
  props: {
    module: {
      type: String,
      required: true
    },
    moduleId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '备注'
    }
  },
  setup(props) {
    const comments = ref([])
    const submitting = ref(false)
    const value = ref('')
    const $store = useStore()
    const userId = $store.state.User.uid
    const userAvastr = userAvatar(userId, 'small')
    const handle = {
      $store,
      ...mapActions('Comment', ['create', 'queryModule', 'delete'])
    }
    const del = item => {
      handle
        .delete({
          module: props.module,
          moduleId: props.moduleId,
          id: item.id
        })
        .then(() => {
          const index = comments.value.findIndex(data => data.id === item.id)
          comments.value.splice(index, 1)
        })
    }
    const handleSubmit = () => {
      if (!value.value) {
        return
      }
      handle
        .create({
          module: props.module,
          moduleId: props.moduleId,
          data: {
            content: value.value,
            user: { id: userId, name: $store.state.User.name }
          }
        })
        .then(res => {
          console.log(res)
          submitting.value = true
          setTimeout(() => {
            submitting.value = false
            comments.value = [
              {
                id: res.id,
                author: res.user.name,
                content: res.content,
                showDel: res.user.id === userId,
                avatar: res.user.id
                  ? userAvatar(res.user.id, 'small')
                  : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                datetime: moment(res.updateTime).format('YYYY-MM-DD')
              },
              ...comments.value
            ]
            value.value = ''
          }, 1000)
        })
    }
    onMounted(() => {
      queryNoteList()
    })
    const queryNoteList = () => {
      handle
        .queryModule({
          module: props.module,
          moduleId: props.moduleId,
          params: { s: 0, l: 10, o: '-createTime' }
        })
        .then(res => {
          const item = res.data.map(data => ({
            id: data.id,
            author: data.user.name,
            content: data.content,
            showDel: data.user.id === userId,
            avatar: data.user.id
              ? userAvatar(data.user.id, 'small')
              : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            datetime: moment(data.updateTime).format('YYYY-MM-DD')
          }))
          comments.value.push(...item)
        })
    }
    return {
      comments,
      submitting,
      value,
      handleSubmit,
      userAvastr,
      del
    }
  }
})
</script>
<style scoped>
:deep(.ant-comment-inner) {
  padding: 0;
}
</style>
