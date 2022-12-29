<template>
  <div class="d-data-card d-data-space">
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
        <a-space>
          <slot name="headStartBtnMore" v-bind:entity="detail.entity"> </slot>
        </a-space>
        <slot name="head-btn">
          <a-space>
            <a-button v-if="slot.create" type="primary" @click="openNew"
              >新建</a-button
            >
          </a-space>
        </slot>
        <a-space>
          <slot name="headBtnMore" v-bind:entity="detail.entity"> </slot>
        </a-space>
      </template>
    </d-header>
    <slot name="statistic"> </slot>
    <!-- 工具栏  -->
    <d-toolbar
      class="d-data-space-toolbar"
      :keyword="read.params.k"
      :loading="read.loading"
      :param="filters.param"
      @search="changeFilter"
      @load="load"
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
      class="card-darawer"
      v-if="slot.detail"
      placement="right"
      :closable="true"
      v-model:visible="detail.modal"
      :width="opt.detailWidth"
    >
      <slot name="detail" v-bind:entity="detail.entity"></slot>
    </a-drawer>
    <div class="d-data-space-table padding-m">
      <a-empty v-if="!read.total" class="emptycen" description="没有数据" />
      <a-list
        v-else
        :grid="{ gutter: gutter, ...col }"
        :data-source="read.row"
        class="h-full overflow-hidden"
      >
        <template #renderItem="{ item }">
          <slot name="card" :item="item">
            <a-list-item>
              <a-card hoverable class="relative">
                <template #cover="{ item }">
                  <slot name="cover" :item="item"></slot>
                </template>

                <a-card-meta style="margin: 0">
                  <template #title>
                    <slot name="title" :item="item"></slot>
                  </template>

                  <template #avatar>
                    <slot name="avatar" :item="item"></slot>
                  </template>

                  <template #description>
                    <slot name="description" :item="item"></slot>
                  </template>
                </a-card-meta>

                <slot name="content" :item="item"></slot>

                <d-row-action
                  v-if="rowAction"
                  style="margin: 12px -24px 0 -24px"
                  :item="item"
                  :detail="deta ? (slot.detail ? false : true) : slot.detail"
                  :edit="slot.edit"
                  :more="more"
                  @edit="openEdit"
                  @trash="confirmDelete"
                  @detail="openDetail"
                  :del="del"
                  type="card"
                >
                  <template #action="{ item }" v-if="actionSlot">
                    <slot name="action" :item="item"></slot>
                  </template>

                  <template #actionMore="{ item }" v-if="actionMoreSlot">
                    <slot name="actionmore" :record="item"></slot>
                  </template>

                  <template #menuActionEnd="{ item }" v-if="menuActionEndSlot">
                    <slot name="menuActionEnd" :item="item"></slot>
                  </template>
                </d-row-action>
              </a-card>
            </a-list-item>
          </slot>
        </template>
      </a-list>
    </div>
    <div class="d-data-space-footer" style="">
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
  name: 'dDataCard',
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
    gutter: {
      type: Number,
      default: 16
    },
    dellButton: {
      type: Boolean,
      default: false
    },
    col: {
      type: Object,
      default: {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4
      }
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
    },
    more: {
      type: Boolean,
      default: true
    },
    deta: {
      type: Boolean,
      default: false
    },
    del: {
      type: Boolean,
      default: true
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
.d-data-card {
  display: flex;
  padding: 4px 8px;
  flex-direction: column;
  background-color: #fff;
}
.data-card-papes {
}
.emptycen {
  position: absolute;
  top: 50%;
  left: 50%;
  /* transform: translate(-50%, -50%); */
}
.data-card-table-list {
  margin-bottom: 10px;
  flex: auto;
  position: relative;
}
:deep(.ant-table-wrapper) {
  flex: auto;
}
:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
:deep(.ant-table) {
  flex: 1;
}
:deep(.ant-pagination) {
  border-color: #e8e8e8;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  border-top: 1px solid;
  border-color: #eeeeee;
  margin: 0;
  padding: 16px 0;
}
/* test  */
:deep(.ant-card-body) {
  /* padding-bottom: 0; */
  position: relative;
}

:deep(.d-data-card .ant-drawer-body) {
  height: 100%;
}
:deep(.ant-drawer-body) {
  height: 100%;
  overflow: auto;
}

:deep(.ant-row) {
  margin: 0 !important;
  overflow: auto;
}

:deep(.ant-drawer-body) {
  height: 100%;
}

/* .d-data-space-footer {
  display: flex;
  bottom: 20px;
  right: 20px;
} */
</style>
