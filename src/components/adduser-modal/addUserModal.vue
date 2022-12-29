<!--
* @FileDescription: 添加用户对话框组件
* @Author: MaiTingCong
*
-->
<template>
  <div>
    <a-button type="primary" @click="showModal">添加用户</a-button>
    <a-modal
      v-model:visible="visible"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="reset"
      cancelText="取消"
      okText="确认"
      width="50%"
    >
      <slot name="modal-center">
        <div class="d-flex">
          <h2>{{ title }}</h2>
          <span style="margin-left: 8px; color: #999">选择添加用户</span>
        </div>
        <div>
          <div style="color: #999; margin-bottom: 8px">
            输入用户账号，选择添加到备选区：
          </div>
          <a-row align="middle" type="flex" justify="space-between">
            <a-col :span="24">
              <a-select
                mode="multiple"
                placeholder="输入用户名搜索添加"
                v-model:value="selectedItems"
                style="width: 100%"
              >
                <a-select-option
                  v-for="item in filteredOptions"
                  :key="item"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-col>
          </a-row>
          <div class="d-flex justify-center" style="margin: 20px 0">
            <a-button type="primary">重置</a-button>
            <a-button type="primary" style="margin-left: 8px" @click="onAddUser"
              >添加</a-button
            >
          </div>
        </div>
        <a-list :grid="{ gutter: 16, column: 3 }" :data-source="selectedItems">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card :bodyStyle="{ padding: '10px' }">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <d-avatar-upload
                      modules="User"
                      style="width: 40px"
                      imgWidth="100%"
                      imgHeight="40px"
                      :id="item"
                      :imgOps="{ objectFit: 'cover' }"
                      :key="item"
                      :rowAction="false"
                      radius="circle"
                    ></d-avatar-upload>
                    <div style="margin-left: 12px">
                      <div>{{ item }}</div>
                      <div style="margin-top: 4px; color: #999">用户的简介</div>
                    </div>
                  </div>
                  <div>
                    <a-button size="small" @click="deleteSelete(item)">
                      <CloseOutlined />
                    </a-button>
                  </div>
                </div>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </slot>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { mapActions, useStore } from 'vuex'
/**
 * @description: 添加用户弹窗
 */
export default defineComponent({
  props: {
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  setup(props, content) {
    const visible = ref(false)

    const showModal = () => {
      // 显示弹窗
      visible.value = true
    }
    const handleOk = e => {
      // 确认按钮
      onAddUser()
    }
    const pagination = {
      // 分页
      onChange: page => {
        console.log(page)
      },
      pageSize: 5
    }
    const selectedItems = ref([]) // 选中的用户
    const listData = ref([]) // 列表数据
    const OPTIONS = ref([])
    const $store = useStore()
    const roleHandler = {
      // 关联角色
      $store,
      ...mapActions(props.store, ['addUser', 'queryUser'])
    }
    const userHandler = {
      $store,
      ...mapActions('User', ['query'])
    }

    onMounted(() => {
      roleHandler
        .queryUser({ id: props.role.id, params: { o: '-_id' } })
        .then(res => {
          listData.value = res.data
        })
      let params = { o: '-_id' }
      userHandler.query(params).then(res => {
        if (res.data.length > 0) {
          OPTIONS.value = res.data
        }
      })
    })
    const filteredOptions = computed(() => {
      let outListData = listData.value.map(data => data.id)
      let OPTIONSstr = OPTIONS.value.map(data => data.id)
      return OPTIONSstr.filter(o => !outListData.includes(o))
    })
    // 添加用户
    function onAddUser() {
      roleHandler
        .addUser({ id: props.role.id, data: { userId: selectedItems.value } })
        .then(res => {
          if (res) {
            selectedItems.value.forEach(data => {
              let newOP = OPTIONS.value.filter(o => o.id === data)
              listData.value.push(newOP[0])
              visible.value = false
              content.emit('addok', selectedItems.value)
              selectedItems.value = []
            })
          }
        })
    }
    // 删除选中的用户
    const deleteSelete = item => {
      let index = selectedItems.value.indexOf(item)
      selectedItems.value.splice(index, 1)
    }
    return {
      visible,
      showModal,
      handleOk,
      listData,
      pagination,
      selectedItems,
      filteredOptions,
      onAddUser,
      deleteSelete
    }
  },
  props: {
    role: {
      type: Object,
      required: true
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    // store模块必须包含'addUser', 'queryUser',
    store: {
      type: String,
      required: true
    },
    // modal标题
    modalTitle: {
      type: String
    },
    title: {
      type: String
    }
  }
})
</script>
<style>
.justify-space-between {
  justify-content: space-between;
}
.align-center {
  align-items: center;
}
</style>
