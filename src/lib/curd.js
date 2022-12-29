import {
  ref,
  reactive,
  provide,
  computed,
  onMounted,
  useSlots,
  toRaw
} from 'vue'
import { mapActions, useStore } from 'vuex'
/**
 * CurdMixin 构造包含完整CURD功能的组件
 * @prop {String,Object} storeModel - 存储模型
 * @prop {Object} filter - 过滤条件
 * @prop {String} sort - 排序字段
 * @prop {String} desc - 排序方式
 * @prop {Number} pageSize - 分页大小
 * @prop {String,Object} avatar - 头像
 * @prop {Boolean} rowAction - 是否显示行操作
 * 主要参数：
 * storeModel: 执行存储的Store Model，指定名称，或者一个完整的配置对象。
 * filter: 固定的过滤参数。
 */
export const CurdMixin = {
  props: {
    auto: {
      type: Boolean,
      default: true
    },
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
    desc: {
      type: Boolean,
      default: true
    },
    newEntity: {
      type: Function
    },
    entity: {
      type: Object,
      default: () => ({})
    },
    pageSize: {
      type: Number,
      default: 10
    },
    avatar: {
      type: [String, Object]
    },
    rowAction: {
      type: Boolean,
      default: true
    },
    keyWord: {
      type: String,
      default: ''
    }
  }
}

/*
 * useCURD - 实现CURD功能
 * @param {Object} options - 参数,props引用自CurdMixin,context引用自组件
 */
export const useCURD = ({ props, context }) => {
  var defSort = '-_id'

  const slot = {
    // 插槽的状态
    create: context.slots.newForm ? true : false,
    edit: context.slots.editForm ? true : false,
    detail: context.slots.detail ? true : false,
    filters: context.slots.filters ? true : false,
    exfilters: context.slots.exfilters ? true : false
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
  let dellBtns = computed(() => !selectedIds.value.length)

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
    open: false, // 是否展开过滤面板

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
    selection.value = []
    let params = param
    if (Object.keys(props.filter).length > 0) {
      params = {
        ...param,
        ...props.filter
      }
    }
    read.loading = true
    handler
      .query(params)
      .then(res => {
        // 查询成功后，回填属性

        read.total = res.total
        read.row = res.data
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

   * @param  e

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
  // 下载文件
  // const doDownload = (param) => {
  // }
  const doDownload = param => {
    read.loading = true
    handler
      .query(param)
      .then(res => {
        // 查询成功后，回填属性

        read.total = res.total
        read.row = res.data
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
  const selection = ref()
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      selection.value = selectedRows
      selectedIds.value = selectedRowKeys
    },
    selectedRowKeys: selectedIds,
    onSelect: (record, selected, selectedRows) => {
      //   console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(selected, selectedRows, changeRows)
    }
  }

  const actionSlot = !!useSlots().action
  const actionMoreSlot = !!useSlots().actionmore
  const menuActionEndSlot = !!useSlots().menuActionEnd

  //先载入数据
  onMounted(() => {
    if (props.auto) {
      load()
    }
  })
  return {
    handler,
    slot,
    create,
    edit,
    read,
    filters,
    detail,
    form,
    dialog,
    rowSelection,
    selectedIds,
    dellBtns,

    //--- slot show--
    actionSlot,
    actionMoreSlot,
    menuActionEndSlot,

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
    doDownload,
    // 设置表单是
    setOkButton,
    setCancelButton,
    showSizeChange
  }
}

export const setupForm = (props, context) => {
  const model = props.formRef
  return {
    model
  }
}

export const FormMix = {
  props: {
    formRef: {
      type: Object,
      require: true
    },
    dialogRef: {
      type: Object,
      require: true
    },
    value: {
      type: Object,
      default: () => ({})
    },
    findEntity: {
      type: Object
    },
    setOkButton: {
      type: Function //参数类型：函数
    },
    setCancelButton: {
      type: Function //参数类型：函数
    }
  }
}
