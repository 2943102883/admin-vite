<template>
  <div width="100%" class="d-data-space">
    <d-header
      class="d-data-space-header"
      v-if="title"
      :title="title"
      :subtitle="subtitle"
      :icon="avatar"
    >
      <template #icon>
        <slot name="icon"></slot>
      </template>

      <template #headTitle>
        <slot name="headTitle"></slot>
      </template>

      <template #control>
        <a-button v-if="slot.create" type="primary" @click="openNew"
          >新建</a-button
        >
        <a-button v-if="dellButton" @click="confirmDelete">删除</a-button>
      </template>
    </d-header>
    <!-- 工具栏  -->
    <d-toolbar
      class="d-data-space-toolbar"
      :keyword="read.params.k"
      :loading="read.loading"
      :param="filters.param"
      :createButton="slot.create"
      @search="changeFilter"
      @load="load"
      @create="openNew"
      @reset="resetQuery"
    >
      <template #filters="{ param }">
        <slot name="filters" v-bind:param="param"></slot>
      </template>
    </d-toolbar>
    <dialog-active
      v-if="slot.create"
      v-model:visible="create.modal"
      v-model:processing="create.processing"
      :error="create.error"
      :width="opt.dialogWidth"
      :errorMessage="create.errorMessage"
      @confirm="submitNew()"
      title="新建"
    >
      <slot
        name="newForm"
        v-bind:entity="create.entity"
        v-bind:formRef="form.create"
        >没有定义表单...</slot
      >
    </dialog-active>
    <dialog-active
      v-if="slot.edit"
      v-model:visible="edit.modal"
      v-model:processing="edit.processing"
      :error="edit.error"
      :width="opt.dialogWidth"
      :errorMessage="edit.errorMessage"
      @confirm="submitEdit()"
      title="编辑"
    >
      <slot
        name="editForm"
        v-bind:entity="edit.entity"
        v-bind:formRef="form.edit"
        >没有定义表单...</slot
      >
    </dialog-active>
    <a-drawer
      v-if="slot.detail"
      placement="right"
      :closable="true"
      v-model:visible="detail.modal"
      :width="opt.detailWidth"
    >
      <slot name="detail" v-bind:entity="detail.entity"></slot>
    </a-drawer>
    <div
      class="d-data-space-table"
      :style="{ width: '100%', margin: gutter + 'px 0px' }"
    >
      <a-list :data-source="read.row">
        <template #renderItem="{ item }">
          <slot name="list" v-bind:item="item">
            <a-list-item>
              <a-list-item-meta
                :description="item[descriptionField]"
              ></a-list-item-meta>
              <template #title>
                <slot name="title" v-bind:item="item">{{
                  item[titleField]
                }}</slot>
              </template>
              <template #avatar v-if="avatarField">
                <slot name="avatar" v-bind:item="item"></slot>
              </template>
              <template #actions>
                <span></span>
                <d-row-action
                  :item="item"
                  :detail="slot.detail"
                  :edit="slot.edit"
                  @edit="openEdit"
                  @trash="confirmDelete"
                  @detail="openDetail"
                >
                  <slot name="action"></slot>
                </d-row-action>
                <slot name="content" v-bind:item="item"></slot>
              </template>
            </a-list-item>
          </slot>
        </template>
      </a-list>
    </div>
    <div class="d-data-space-footer" :style="{ width: '100%', padding: '8px' }">
      <a-pagination
        :size="read.pagination.size"
        :total="read.pagination.total"
        :page-size="read.pagination.pageSize"
        :show-total="read.pagination.showTotal"
        :current="read.pagination.current"
        @change="changePage"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, createVNode } from 'vue'
import { CurdMixin, useCURD } from '@/lib/curd'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  setup(props, context) {
    return {
      ...useCURD({
        props,
        context
      })
    }
  },
  mixins: [CurdMixin],
  props: {
    titleField: {
      type: [Function, String]
    },
    descriptionField: {
      type: [Function, String]
    },
    avatarField: {
      type: [Function, String]
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    dialogWidth: {
      type: [String, Number],
      default: 480
    },
    search: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Boolean,
      default: false
    },
    opt: {
      type: Object,
      default: {
        dialogWidth: '480px',
        detailWidth: '480px'
      }
    }
  },
  methods: {
    confirmDelete(item) {
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要删除数据?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: () => {
          this.doDelete(item)
        }
      })
    }
  }
})
</script>

<style scoped>
:deep(.ant-drawer-body) {
  height: 100%;
}
</style>
