import {
  ref,
  reactive
} from 'vue';

import {
  mapActions,
  useStore
} from "vuex"


export const CurdMixin = {
  props: {
    storeModel: {
      type: [String, Object],
      required: true
    },
    filter: {
      type: Object,
    },
    sort: {
      type: String,
      default: "id"
    },
    desc: {
      type: Boolean,
      default: true
    },
    newEntity: {
      type: Function
    },
    parentKey: {
      type: String,
      default: "parent"
    }
  }

}
/*
 * 装配
 * @param {props,context}  
 * @returns 
 */
export const useTree = ({
  props,
  context
}) => {

  var defSort = "-_id"
  const slot = {
    create: context.slots.newForm ? true : false,
    edit: context.slots.editForm ? true : false,
    detail: context.slots.detail ? true : false,
    filters: context.slots.filters ? true : false,
    exfilters: context.slots.exfilters ? true : false
  }


  const $store = useStore()
  const handler = {
    $store,
    ...mapActions(
      props.storeModel, [
        'create',
        'update',
        'query',
        'delete'
      ])
  }
  const form = {
    create: ref(),
    edit: ref()
  }

  /**
   * 新建状态属性
   */
  const create = reactive({
    modal: false,
    processing: false,
    entity: {},
    error: false,
    errorMessage: ""
  })
  /**
   * 编辑状态属性
   */
  const edit = reactive({
    modal: false,
    processing: false,
    entity: {},
    error: false,
    errorMessage: ""
  })

  const defaultParam = {
    l: 0,
    s: 0,
    o: defSort,
    k: ""
  }

  var dataMap = {}
  /**
   * 查询状态属性
   */
  const read = reactive({
    loading: false, //载入中
    total: 0, //数据总数
    row: [], //数据
    error: false, //出错
    errorMessage: "", //出错信息
    params: { //基本查询参数
      ...defaultParam
    },
    parentKey: props.parentKey,
    parent: null, //上级的id
    filter: props.filter, //固定过滤参数
    root: {
      id: "0",
      children: null
    }
  })
  const tree = reactive({
    expandKeys: [],
    selectKeys: []
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
    query(read.parent, param)
  }

  /**
   * 执行查询
   * @param  param  查询的条件
   */
  const query = (parent, param) => {
    read.loading = true
    if (parent) {
      param[read.parentKey] = parent
    }
    console.log(param)
    handler.query(param).then(res => {
      // 查询成功后，回填属性
      read.total = res.total
      if (parent) {
        if (res.data.length > 0) {
          dataMap[parent].children = read.data
        }
      } else {
        read.row = res.data
      }
      read.params.o = param.o
      read.params.k = param.k
      read.loading = false
      if (parent) {}
    }).catch(error => {
      read.error = true
      read.loading = false
      read.errorMessage = error
    })
  }

  /**
   *  响应分页、查询参数和排序的变化
   * @param page 
   * @param  filters 
   * @param  sorter 
   */
  const change = (filters, sorter) => {
    let dir = "-"
    if (sorter.order) {
      dir = sorter.order === "descend" ? "-" : ""
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
    query(param)
  }

  /**
   * 响应查询条件的变化
   * @param  params 
   */
  const changeFilter = (params) => {
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
    filters.param = {}
    let param = {
      ...read.filter,
      ...defaultParam
    }
    query(param)
  }


  /**
   * 打开新建表单界面
   */
  const openNew = (node) => {
    if (form.create.value) {
      form.create.value.resetFields()
    }
    create.entity = {}
    if (node) {
      create.entity[read.parentKey] = node.id
    }
    create.modal = true
  }

  /**
   * 提交新建数据
   * @param  e 
   */
  const submitNew = (e) => {
    form.create.value.validate()
      .then(() => {
        create.processing = true
        handler.create({
          data: create.entity
        }).then(() => {

          load()
          create.processing = false
          create.modal = false
        }).catch((error) => {
          if (error.response.data) {
            create.errorMessage = error.response.data.message
          } else {
            create.errorMessage = "保存时出现了异常，暂时无法保存。"
          }
          create.error = true
          //   create.processing = false
        })

      })
      .catch(error => {
        console.log("error:", error)
      });
  }
  const cancelNew = () => {
    create.modal = false

  }
  const openEdit = (item) => {
    if (form.edit.value) {
      form.edit.value.resetFields()
    }
    edit.entity = {
      ...item
    }
    edit.modal = true
  }
  const submitEdit = () => {
    form.edit.value
      .validate()
      .then(() => {
        edit.processing = true
        handler.update({
          data: edit.entity
        }).then(() => {

          load()
          edit.processing = false
          edit.modal = false
        }).catch((error) => {
          if (error.response.data) {
            edit.errorMessage = error.response.data.message
          } else {
            edit.errorMessage = "保存时出现了异常，暂时无法保存。"
          }
          edit.error = true
          edit.processing = false
        })
      })
      .catch(error => {
        console.log("error:", error)
      });
  }
  const cancelEdit = () => {
    edit.modal = false
  }

  const doDelete = (item) => {
    let id = item.id
    handler.delete({
      id
    }).then(() => {
      load()
    }).catch(() => {
      load()
    })
  }
  const openDetail = (item) => {
    detail.entity = {
      ...item
    }
    detail.modal = true
    context.emit("detail", detail.entity)
  }
  const closeDetail = () => {
    detail.modal = false
  }

  const selection = ref()
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      selection.value = selectedRows
      //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      //   console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(selected, selectedRows, changeRows);
    },
  }
  //先载入数据
  load()
  return {
    handler,
    slot,
    create,
    edit,
    read,
    tree,
    filters,
    detail,
    form,
    rowSelection,

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
    changeFilter

  }

}

export const setupForm = (props, context) => {
  const model = props.formRef
  return {
    model,
  };
}

export const FormMix = {
  props: {
    formRef: {
      type: Object,
      require: true

    },
    value: {
      type: Object,
      defaultValue: {}
    }
  },
}
