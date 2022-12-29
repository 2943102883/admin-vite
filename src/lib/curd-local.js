import {
  ref,
  reactive
} from 'vue';

import {
  mapActions,
  useStore
} from "vuex"


export const useCURDLocal = ({
  props,
  context
}) => {

  var defSort = "id"
  const data = reactive({
    row: [],
    processing: false
  })


  const createNew = () => {

  }
  const saveNew = () => {

  }
  const startEdit = () => {

  }
  const saveEdit = () => {

  }
  const doDelete = () => {

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
}
