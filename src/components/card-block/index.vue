<template>
  <div>
    <a-card size="small" :loading="read.loading">
      <template #title>
        <slot name="cardTitle" :breadcrumb="breadcrumb">
          <a-breadcrumb separator=">">
            <a-breadcrumb-item
              class="cursor-pointer"
              v-for="(row, index) in breadcrumb"
              :key="row.id"
              @click="queryById(row, index)"
              >{{ row.title }}</a-breadcrumb-item
            >
          </a-breadcrumb>
        </slot>
      </template>

      <template #extra>
        <slot name="headStart" :selectedIds="selectedIds" />
        <a-space>
          <a-button size="small" type="" @click="load">
            <RedoOutlined />
            刷新
          </a-button>

          <a-button
            size="small"
            type="primary"
            @click="openNew"
            v-if="slot.create"
          >
            <PlusOutlined />
            新建
          </a-button>

          <a-button
            size="small"
            type="primary"
            danger
            :disabled="selectedIds.length == 0"
            v-if="del"
            @click="confirmDelete(selectedIds)"
          >
            <DeleteOutlined />
            删除
          </a-button>
          <slot name="headEnd" :selectedIds="selectedIds" />
        </a-space>
      </template>

      <div class="w-full flex flex-col">
        <a-checkbox-group v-model:value="selectedIds" class="flex-1">
          <a-list
            :grid="col"
            :data-source="read.row"
            size="small"
            class="w-full h-[400px] flex flex-col"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card size="small">
                  <template #title>
                    <a-dropdown :trigger="['click']">
                      <span @click.prevent class="text-blue-400 cursor-pointer"
                        >{{ item.name }}
                        <slot name="cardTitleTag" :item="item">
                          <a-tag
                            class="!ml-2"
                            color="#2db7f5"
                            v-if="item.typeKey == 'farm'"
                            >基地</a-tag
                          >
                          <a-tag
                            class="!ml-2"
                            color="#87d068"
                            v-if="item.typeKey == 'pond'"
                            >鱼池</a-tag
                          >
                        </slot>

                        <DownOutlined
                      /></span>
                      <template #overlay>
                        <a-menu>
                          <slot name="actionMore" v-bind:item="item"></slot>
                          <template v-if="slot.detail">
                            <a-menu-item @click="openDetail">
                              <a-button
                                type="link"
                                class="ac-btn flex items-center"
                              >
                                <template #icon>
                                  <ProfileOutlined
                                    :style="{ color: '#1890ff' }"
                                  />
                                </template>
                                详情
                              </a-button>
                            </a-menu-item>
                          </template>
                          <template v-if="slot.edit">
                            <a-menu-item @click="openEdit(item)">
                              <a-button
                                type="link"
                                class="ac-btn flex items-center"
                              >
                                <template #icon>
                                  <FormOutlined :style="{ color: '#1890ff' }" />
                                </template>
                                编辑
                              </a-button>
                            </a-menu-item>
                          </template>
                          <template v-if="del">
                            <a-menu-item @click="confirmDelete">
                              <a-button
                                type="link"
                                class="ac-btn !flex items-center"
                              >
                                <template #icon>
                                  <DeleteOutlined
                                    :style="{ color: '#ff4949' }"
                                  />
                                </template>
                                删除
                              </a-button>
                            </a-menu-item>
                          </template>
                          <template v-if="backward && item.typeKey !== 'pond'">
                            <a-menu-item @click="queryNext(item)">
                              <a-button
                                type="link"
                                class="ac-btn !flex items-center"
                              >
                                <template #icon>
                                  <svg-icon
                                    local-icon="send-backward"
                                    class="text-[#1890ff]"
                                  ></svg-icon>
                                </template>
                                下一级
                              </a-button>
                            </a-menu-item>
                          </template>
                          <slot name="menuActionEnd" v-bind:item="item"> </slot>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </template>
                  <template #extra>
                    <a-checkbox :value="item.id"></a-checkbox>
                  </template>

                  <div class="flex">
                    <slot name="card" :item="item">
                      <div>
                        <d-avatar-upload
                          class="w-[90px] h-[90px]"
                          :img-ops="{ objectFit: 'cover' }"
                          :moduleId="item.id"
                          :id="item.image?.id"
                          :name="item.image?.name"
                          :storeModel="storeModel"
                          :rowAction="false"
                          :preview="false"
                        />
                      </div>
                      <div class="flex-1 ml-3">
                        <slot name="cardBody" :item="item">
                          <h4>
                            {{ item.shortName }}
                          </h4>
                          <a-descriptions
                            size="small"
                            :column="1"
                            v-if="item.property.length"
                          >
                            <a-descriptions-item
                              v-for="row in item.property"
                              :label="row.label"
                              :key="row.sort"
                              >{{ row.value }}</a-descriptions-item
                            >
                          </a-descriptions>
                        </slot>
                      </div>
                    </slot>
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-checkbox-group>
        <a-divider class="!my-3" />

        <div class="text-right">
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
    </a-card>

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
  </div>
</template>
<script>
import {
  onMounted,
  reactive,
  watch,
  ref,
  toRaw,
  computed,
  provide,
  useSlots,
  defineComponent,
  createVNode
} from 'vue'
import { mapActions, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'card-block',
  props: {
    storeModel: {
      type: [String, Object],
      required: true
    },
    filter: {
      type: Object,
      default: () => ({})
    },
    defaultParam: {
      type: Object,
      default: () => ({})
    },
    sort: {
      type: String,
      default: 'id'
    },

    entity: {
      type: Object,
      default: () => ({})
    },
    pageSize: {
      type: Number,
      default: 10
    },

    rowAction: {
      type: Boolean,
      default: true
    },
    keyWord: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    backward: {
      type: Boolean,
      default: true
    },
    col: {
      type: Object,
      default: {
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 3
      }
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    dialogWidth: {
      type: [String, Number],
      default: 480
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
    del: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const breadcrumb = ref([])

    var defSort = '-_id'

    const slot = {
      // 插槽的状态
      create: context.slots.newForm ? true : false,
      edit: context.slots.editForm ? true : false,
      detail: context.slots.detail ? true : false
    }

    const $store = useStore()
    const handler = {
      // 映射到store的方法
      $store,
      ...mapActions(props.storeModel, ['create', 'update', 'query', 'delete'])
    }
    const form = {
      create: ref(),
      edit: ref()
    }

    const dialog = {
      create: ref(),
      edit: ref(),
      okButton: ref(false),
      cancelButton: ref(false)
    }

    const setOkButton = val => {
      dialog.okButton.value = val
    }

    const setCancelButton = val => {
      dialog.cancelButton.value = val
    }

    /**
     * 选择
     */

    let selectedIds = ref([])

    /**
     * 新建状态属性
     */
    const create = reactive({
      modal: false,
      processing: false,
      entity: {},
      error: false,
      errorMessage: ''
    })
    /**
     * 编辑状态属性
     */
    const edit = reactive({
      modal: false,
      processing: false,
      entity: {},
      error: false,
      errorMessage: ''
    })

    const defaultParam = {
      // 默认查询参数
      l: props.pageSize ? props.pageSize : 10,
      s: 0,
      o: defSort,
      k: props.keyWord ? props.keyWord : ''
    }
    /**
     * 查询状态属性
     */
    const read = reactive({
      loading: false, //载入中

      total: 0, //数据总数

      row: [], //数据

      error: false, //出错

      errorMessage: '', //出错信息

      params: {
        //查询参数

        ...defaultParam
      },
      pagination: {
        //分页参数

        total: 0,
        current: 1,
        pageSize: defaultParam.l,
        showSizeChanger: props.showSizeChanger,
        showQuickJumper: props.showQuickJumper,
        pageSizeOptions: props.pageSizeOptions,
        size: 'small'
      },
      filter: props.filter //固定过滤参数
    })
    const filters = reactive({
      param: {} // 搜索参数
    })

    /**

   * 详细界面状态属性

   */
    const detail = reactive({
      modal: false,
      entity: {}
    })

    /**

   * 以当前的参数重新载入数据(刷新)

   */
    const load = () => {
      let param = {
        ...read.filter,
        ...read.params,
        ...filters.param
      }
      query(param)
    }

    /**

   * 执行查询

   * @param  param  查询的条件

   */
    const query = param => {
      selectedIds.value = []
      read.loading = true
      handler
        .query(param)
        .then(res => {
          // 查询成功后，回填属性

          read.total = res.total
          read.row = res.data || []
          read.pagination.total = res.total
          read.pagination.pageSize = param.l
          read.pagination.current = param.s / param.l + 1
          read.params.l = param.l
          read.params.s = param.s
          read.params.o = param.o
          read.params.k = param.k
          read.loading = false
        })
        .catch(error => {
          read.error = true
          read.loading = false
          read.errorMessage = error.response.data.msg
        })
    }

    /**

   *  响应分页、查询参数和排序的变化

   * @param page

   * @param  filters

   * @param  sorter

   */
    const change = (page, filters, sorter) => {
      let dir = '-'
      if (sorter.order) {
        dir = sorter.order === 'descend' ? '-' : ''
        if (sorter.field) {
          dir = dir + sorter.field
        } else {
          dir = defSort
        }
      } else {
        dir = defSort
      }
      let param = {
        ...read.filter,
        ...read.params,
        ...filters.param
      }
      param.o = dir
      param.s = (page.current - 1) * page.pageSize || 0
      param.l = page.pageSize || 10
      query(param)
    }

    /**

   *  仅仅响应分页的变化

   * @param  page

   * @param  pageSize

   */
    const changePage = (page, pageSize) => {
      change(
        {
          current: page,
          pageSize: pageSize
        },
        filters,
        {}
      )
    }
    //改变每页条数
    const showSizeChange = (_, pageSize) => {
      change(
        {
          current: 1,
          pageSize: pageSize
        },
        filters,
        {}
      )
    }

    /**

   * 响应查询条件的变化

   * @param  params

   */
    const changeFilter = params => {
      filters.param = params
      let param = {
        ...read.filter,
        ...read.params,
        ...filters.param
      }

      param.s = 0
      query(param)
    }

    /**

   * 响应查询条件的变化

   * @param  params

   */
    const changeQuery = params => {
      filters.param = params
      let param = {
        ...read.filter,
        ...read.params,
        ...filters.param
      }
      param.s = 0
      query(param)
    }

    /**

   * 重置全部查询参数,包括分页和排序

   */
    const resetQuery = () => {
      filters.param = toRaw(props.defaultParam)
      let param = {
        ...read.filter,
        ...filters.param,
        ...defaultParam
      }
      query(param)
    }

    const setFilter = filters => {
      read.filter = {
        ...read.filter,
        ...filters
      }
      resetQuery()
    }

    /**

   * 打开新建表单界面

   */
    const openNew = () => {
      if (form.create.value) {
        form.create.value.resetFields()
      }
      create.errorMessage = ''
      create.error = false
      create.entity = {}
      create.modal = true
    }

    /**

   * 提交新建数据

   * @param  

   */

    const submitNew = () => {
      if (Object.keys(props.entity).length > 0) {
        create.entity = props.entity
      }
      form.create.value
        .validate()
        .then(() => {
          create.processing = true
          handler
            .create({
              data: create.entity
            })
            .then(() => {
              load()
              create.processing = false
              create.modal = false
            })
            .catch(error => {
              if (error.response.data) {
                create.errorMessage = error.response.data.msg
              } else {
                create.errorMessage = '保存时出现了异常，暂时无法保存。'
              }
              create.error = true
              create.processing = false
            })
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
    // 取消新建
    const cancelNew = () => {
      create.modal = false
    }
    provide('cancelNew', cancelNew)

    // 编辑
    const openEdit = item => {
      if (form.edit.value) {
        form.edit.value.resetFields()
      }

      edit.entity = {
        ...item
      }
      edit.errorMessage = ''
      edit.error = false
      edit.modal = true
    }
    // 提交编辑
    const submitEdit = () => {
      if (Object.keys(props.entity).length > 0) {
        edit.entity = props.entity
      }
      form.edit.value
        .validate()
        .then(() => {
          edit.processing = true
          handler
            .update({
              data: edit.entity
            })
            .then(() => {
              load()
              edit.processing = false
              edit.modal = false
            })
            .catch(error => {
              if (error.response.data) {
                edit.errorMessage = error.response.data.msg
              } else {
                edit.errorMessage = '保存时出现了异常，暂时无法保存。'
              }
              edit.error = true
              edit.processing = false
            })
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
    // 取消编辑
    const cancelEdit = () => {
      edit.modal = false
    }
    provide('cancelEdit', cancelEdit)
    // const doDeletes = () => {
    //   if (selectedIds.value.length) {
    //     console.log(selectedIds)
    //   }
    // }

    //删除功能
    const doDelete = item => {
      let ids
      if (item.id) {
        ids = item.id
      } else if (item instanceof Array) {
        ids = item.join(',')
      }
      handler
        .delete({
          id: ids
        })
        .then(() => {
          load()
        })
        .catch(() => {
          load()
        })
    }
    const openDetail = item => {
      detail.entity = {
        ...item
      }
      detail.modal = true
      context.emit('detail', detail.entity)
    }
    const closeDetail = () => {
      detail.modal = false
    }

    const queryById = (row, index) => {
      let data = {
        [`${row.key}`]: row.id
      }

      if (index >= 0) {
        breadcrumb.value.splice(index + 1)
      }

      read.params = Object.assign(
        {},
        read.params,
        props.backward && { corpId: undefined, parentId: undefined },
        data
      )
      load()
    }

    const queryNext = row => {
      if (row.typeKey == 'farm') {
        breadcrumb.value.push({
          title: row.name,
          id: row.id,
          key: 'parentId'
        })
        queryById({ id: row.id, key: 'parentId', name: row.name })
      }
    }

    const confirmDelete = item => {
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要删除数据?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: () => {
          doDelete(item)
        }
      })
    }

    watch(
      () => props.id,
      id => {
        if (id) {
          breadcrumb.value.push({
            title: props.title,
            id: id,
            key: 'corpId'
          })

          queryById(breadcrumb.value[0])
        }
      },
      {
        immediate: true
      }
    )

    return {
      slot,
      create,
      edit,
      read,
      detail,
      form,
      dialog,
      selectedIds,
      breadcrumb,

      //--- method --

      load,
      query,
      resetQuery,
      openNew,
      submitNew,
      cancelNew,
      openEdit,
      cancelEdit,
      submitEdit,
      doDelete,
      openDetail,
      closeDetail,
      change,
      changePage,
      changeFilter,
      changeQuery,
      setFilter,
      // 设置表单是
      setOkButton,
      setCancelButton,
      showSizeChange,
      queryById,
      queryNext,
      confirmDelete
    }
  }
})
</script>
<style lang="less" scoped>
.ant-breadcrumb > span:last-child {
  color: var(--jjext-color-navbar-icon);
}
:deep(.ant-list-grid .ant-col > .ant-list-item) {
  padding-left: 0;
  padding-right: 0;
}
:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  // display: flex;

  // flex-direction: column;
  // justify-content: center;
}
:deep(.ant-list-empty-text) {
  margin-top: 126px;
}
</style>
