<!--
* @fileDescription: 基于vue的增删改查表格
-->
<template>
  <div class="data-curd-table d-data-space">
    <div class="d-flex justify-space-between d-data-space-header">
      <slot name="header" v-bind:entity="detail.entity">
        <d-header
          v-if="showTopHeader"
          :title="title"
          :subtitle="subtitle"
          :icon="avatar"
          :ids="selectedIds"
        >
          <template #icon>
            <slot name="icon"></slot>
          </template>
          <template #headTitle>
            <slot name="headTitle"></slot>
          </template>

          <template #control="{ ids }">
            <a-space>
              <slot
                name="headStartBtnMore"
                :selectedIds="ids"
                :entity="detail.entity"
              >
              </slot>
            </a-space>
            <slot name="head-btn">
              <a-space>
                <a-button
                  v-if="slot.create && createBtn"
                  type="primary"
                  @click="openNew"
                  >新建</a-button
                >
                <a-button
                  danger
                  type="primary"
                  :disabled="selectedIds.length == 0"
                  v-if="del && editBtn && rowSelections"
                  @click="confirmDelete(selectedIds)"
                  >删除</a-button
                >
              </a-space>
            </slot>
            <a-space>
              <slot
                name="headBtnMore"
                :selectedIds="ids"
                :entity="detail.entity"
              >
              </slot>
            </a-space>

            <!-- <a-button v-if="downloadButton" type="primary" @click="confirmDownload"
              >下载</a-button
            >-->
          </template>
        </d-header>
      </slot>
    </div>
    <slot name="statistic"> </slot>

    <!-- 工具栏  -->
    <d-toolbar
      class="d-data-space-toolbar"
      :keyword="read.params.k"
      :toolbarKeyWord="toolbarKeyWord"
      :loading="read.loading"
      :param="filters.param"
      @search="changeFilter"
      @load="load"
      :resetBtn="resetBtn"
      @reset="resetQuery"
    >
      <template #filtersbtns="{ param }">
        <slot name="filtersbtns" v-bind:param="param"></slot>
      </template>

      <template #filters="{ param }">
        <slot name="filters" v-bind:param="param"></slot>
      </template>
      <template #rightbtns="{ param }">
        <slot name="rightbtns" v-bind:param="param"></slot>
      </template>
    </d-toolbar>
    <dialog-active
      v-if="slot.create"
      :ref="dialog.create"
      v-model:visible="create.modal"
      v-model:processing="create.processing"
      :okButton="dialog.okButton"
      :cancelButton="dialog.cancelButton"
      :error="create.error"
      :width="fullModal ? '100%' : opt.dialogWidth"
      :wrapClassName="fullModal ? 'full-modal' : ''"
      :errorMessage="create.errorMessage"
      @confirm="submitNew()"
      title="新建"
      :footer="formFooter"
    >
      <slot
        name="newForm"
        v-bind:entity="create.entity"
        v-bind:formRef="form.create"
        v-bind:dialogRef="dialog.create"
        v-bind:setOkButton="setOkButton"
        v-bind:setCancelButton="setCancelButton"
        >没有定义表单...</slot
      >
    </dialog-active>
    <dialog-active
      v-if="slot.edit"
      :ref="dialog.edit"
      v-model:visible="edit.modal"
      v-model:processing="edit.processing"
      :okButton="dialog.okButton"
      :cancelButton="dialog.cancelButton"
      :error="edit.error"
      :width="fullModal ? '100%' : opt.dialogWidth"
      :wrapClassName="fullModal ? 'full-modal' : ''"
      :errorMessage="edit.errorMessage"
      @confirm="submitEdit()"
      title="编辑"
      :footer="formFooter"
    >
      <slot
        name="editForm"
        v-bind:entity="edit.entity"
        v-bind:formRef="form.edit"
        v-bind:dialogRef="dialog.edit"
        v-bind:setOkButton="setOkButton"
        v-bind:setCancelButton="setCancelButton"
        >没有定义表单...</slot
      >
    </dialog-active>
    <a-drawer
      v-if="slot.detail && feedback == 'drawer'"
      :placement="placement"
      :closable="true"
      v-model:visible="detail.modal"
      :width="detaulWidth || opt.detailWidth"
      :key="detail.entity"
    >
      <slot name="detail" v-bind:entity="detail.entity"></slot>
    </a-drawer>
    <!-- 使用modal式显示detail -->
    <a-modal
      v-if="slot.detail && feedback == 'modal'"
      v-model:visible="detail.modal"
      :title="title + '详细'"
      :width="fullModal ? '' : detaulWidth || opt.detailWidth"
      :footer="null"
      :key="detail.entity"
      :wrapClassName="fullModal ? 'full-modal' : ''"
    >
      <slot name="detail" v-bind:entity="detail.entity"></slot>
    </a-modal>
    <div class="d-data-space-table">
      <a-table
        :dataSource="read.row"
        :loading="read.loading"
        :pagination="false"
        :rowSelection="rowSelections ? rowSelection : undefined"
        @change="change"
        :size="size"
        :rowKey="rowKey"
        :bordered="bordered"
        :showHeader="showHeader"
        :customRow="customRow"
        :scroll="scroll"
        class="h-full w-full overflow-hidden"
      >
        <a-table-column
          v-for="(col, idx) in columns"
          :title="col.title"
          :data-index="col.dataIndex"
          :key="col.dataIndex"
          :sorter="col.sorter"
          :width="col.width"
          :align="col.align"
          :ellipsis="col.ellipsis !== undefined ? true : col.ellipsis"
          :defaultFilteredValue="col.defaultFilteredValue"
          :defaultSortOrder="col.defaultSortOrder"
          :filtered="col.filtered"
          :filteredValue="col.filteredValue"
          :filters="col.filters"
          :fixed="col.fixed"
        >
          <template #default="{ record }">
            <slot
              :name="'col.' + col.dataIndex"
              v-bind:curd="curd"
              v-bind:record="record"
              >{{ record[col.dataIndex] }}</slot
            >
          </template>
        </a-table-column>
        <a-table-column
          key="_action_"
          title="操作"
          v-if="rowAction"
          :width="48"
          fixed="right"
        >
          <template #default="{ record }">
            <d-row-action
              :item="record"
              :detail="slot.detail"
              :edit="slot.edit"
              :del="del"
              :more="more"
              @edit="openEdit"
              @trash="confirmDelete"
              @detail="openDetail"
            >
              <template #action="{ item }" v-if="actionSlot">
                <slot name="action" :item="item"></slot>
              </template>

              <template #menuActionEnd="{ item }" v-if="menuActionEndSlot">
                <slot name="menuActionEnd" :item="item"></slot>
              </template>

              <template #actionMore="{ item }" v-if="actionMoreSlot">
                <slot name="actionmore" :record="item"></slot>
              </template>
            </d-row-action>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <div
      class="d-data-space-footer"
      v-if="isPagination"
      :style="{ width: '100%', padding: '8px' }"
    >
      <a-pagination
        :size="read.pagination.size"
        :total="read.pagination.total"
        v-model:page-size="read.pagination.pageSize"
        v-model:current="read.pagination.current"
        :showQuickJumper="read.pagination.showQuickJumper"
        :pageSizeOptions="read.pagination.pageSizeOptions"
        :showSizeChanger="read.pagination.showSizeChanger"
        @change="changePage"
        @showSizeChange="showSizeChange"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, createVNode } from 'vue'
import { CurdMixin, useCURD } from '@/lib/curd'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

/**
 * CurdDataTable 基于CurdMixin的表格组件
 */
export default defineComponent({
  name: 'curdDataTable',
  setup(props, context) {
    const confirmDownload = () => {
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要下载文件?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: () => {
          // query(item);
          console.log(123)
        }
      })
    }

    return {
      ...useCURD({
        props,
        context
      }),
      confirmDownload
    }
  },
  mixins: [CurdMixin],
  props: {
    columns: {
      type: Array,
      required: true
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
    placement: {
      type: String,
      default: 'right'
    },
    filtersBox: {
      type: Boolean,
      default: false
    },
    del: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'middle'
    },
    more: {
      type: Boolean,
      default: true
    },
    dellButton: {
      type: Boolean,
      default: true
    },
    // downloadButton: {
    //   type: Boolean,
    //   default: false,
    // },
    formFooter: {
      type: Boolean,
      default: true
    },
    feedback: {
      type: String,
      default: 'drawer' //'modal'
    },
    fullModal: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showTopHeader: {
      type: Boolean,
      default: true
    },
    // 行样式
    customRow: {
      type: Function
    },
    // 滚动条
    scroll: {
      type: Object,
      default() {
        return {
          x: true,
          y: true
        }
      }
    },
    rowAction: {
      type: Boolean,
      default: true
    },
    resetBtn: {
      type: Boolean,
      default: true
    },
    isPagination: {
      type: Boolean,
      default: true
    },
    rowSelections: {
      type: Boolean,
      default: true
    },
    editBtn: {
      type: Boolean,
      default: true
    },
    createBtn: {
      type: Boolean,
      default: true
    },
    bordered: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    pageSizeOptions: {
      type: Array,
      default() {
        return ['10', '20', '50', '100']
      }
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    showQuickJumper: {
      type: Boolean,
      default: true
    },
    toolbarKeyWord: {
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
<style lang="less">
.full-modal {
  .ant-modal {
    width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    overflow: auto;
  }
}
</style>
<style scoped>
:deep(.ant-table-thead > tr > th) {
  font-weight: 600;
}
.data-curd-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 4px 8px;
  overflow: hidden;
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
  overflow: hidden;
}
:deep(.ant-table) {
  flex: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

:deep(.ant-table-body) {
  flex: 1;
  overflow: auto !important;
}

:deep(.ant-table-fixed-header .ant-table-scroll .ant-table-header) {
  overflow: auto !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.ant-table-header::-webkit-scrollbar) {
  height: 0px;
}

:deep(.ant-table-content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
:deep(.ant-table-placeholder) {
  flex: 1;
}

:deep(.ant-table-empty .ant-table-body) {
  display: none;
}

:deep(.ant-table-scroll) {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.ant-empty) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
:deep(.ant-empty-img-simple) {
  transform: scale(1.5);
}
:deep(.ant-pagination) {
  border-color: #e8e8e8;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}
:deep(.ant-table-content) {
  border: 1px solid #eee;
}
:deep(.ant-drawer-body) {
  height: 100%;
  overflow: auto;
}
:deep(.ant-drawer-body) {
  height: 100%;
}
</style>
