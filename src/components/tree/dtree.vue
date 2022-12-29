<template>
  <div class="tree overflow-hidden">
    <a-input-search v-if="showSearch" v-model:value="searchValue" class="w-auto m-2" placeholder="输入关键字"
      @change="reset" />
    <a-divider class="m-0" v-if="showSearch" />
    <div class="treecontent">
      <a-tree :show-icon="true" :blockNode="true" :treeData="treeData" v-model:selectedKeys="selectedKeys"
        @select="onSelect" :replaceFields="replaceFields" :loadData="loadData" class="mb-3">
        <template #title="{ name, type }">
          <slot name="title" :rname="name" :type="type">
            <ClusterOutlined v-if="type == 'dataBase'" />
            <DatabaseOutlined v-else-if="type == 'db'" />
            <TableOutlined v-else />

            <p class="truncate">{{ name }}</p>
          </slot>
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRaw } from 'vue'
import { mapActions, useStore } from 'vuex'
import { message } from 'ant-design-vue'

export default {
  components() { },
  setup(props, context) {
    const $store = useStore()
    let actionArr = props.col.map((item) => item.action)
    const treeHandler = {
      $store,
      ...mapActions(props.storeModel, [...actionArr]),
    }
    let type = window.localStorage.getItem('type')
    let allData = {}
    if (type == 'admin') {
      allData = {
        rootID: '',
        id: '',
        type: props.col[0].type,
        isLeaf: props.col[0].isLeaf,
        name: '所有',
        rendomNum: Math.random(),
        children: [],
        data: {},
      }
    }
    let treeData = ref([])
    let modealVisible = ref(false)
    const formRef = ref()
    const entity = ref()
    const selectedKeys = ref([])
    let showModal = () => {
      modealVisible.value = true
    }

    let params = Object.assign(
      {},
      { l: 1000, s: 0, o: '-_id', k: '' },
      props.params,
    )

    onMounted(() => {
      reset()
    })

    const searchValue = ref()
    let reset = () => {
      treeData.value = []
      if (searchValue.value) {
        params.k = searchValue.value
      }
      treeHandler.query(params).then((res) => {
        if (res.data && res.data.length) {
          let newData = res.data.map((item) => {
            item.rootID = item.id
            item.type = props.col[0].type
            item.isLeaf = props.col[0].isLeaf
            if (item.title) {
              item.name = item.title
            }
            item.rendomNum = Math.random()
            return item
          })

          if (type == 'admin' && props.openAll) {
            newData.unshift(allData)
          }

          treeData.value = newData

          if (newData.length) {
            selectedKeys.value = [newData[0].id]

            let data = {
              id: newData[0].id,
              name: newData[0].name,
              data: newData[0],
            }
            context.emit('changePage', data)
          }
        } else {
          treeData.value = []
        }
      })
      params.k = ''
    }

    let updateForm = (val) => {
      entity.value = val
    }

    let replaceFields = reactive({
      title: 'name',
      key: 'id',
    })

    let loadData = async (node) => {
      if (!node.dataRef.rootID) return Promise.resolve()
      let id = node.dataRef.rootID
      let type = node.dataRef.type
      if (node.dataRef.children) {
        Promise.resolve()
        return
      }
      const cLength = props.col.length
      if (type == props.col[cLength - 1].type) {
        node.dataRef.children = []
        Promise.resolve()
        return
      }
      const findindex = props.col.findIndex((item) => item.type == type)
      const element = props.col[findindex + 1]
      let children = []
      try {
        let res = await treeHandler[actionArr[findindex + 1]]({ id, params })
        if (res.data.length) {
          children = res.data.map((item) => {
            item.schoolName = node.dataRef.name
            return {
              rootID: id,
              id: item.id,
              name: item[element.name],
              schoolName: node.dataRef.name,
              type: element.type,
              isLeaf: element.isLeaf,
              rendomNum: Math.random(),
              nodeJson: JSON.stringify(item),
            }
          })
          node.dataRef.children = children
        }
      } catch (error) {
        node.dataRef.children = children
      }

      Promise.resolve()
    }
    let onSelect = (_, { node }) => {
      let name = node.dataRef.type
      let id = node.dataRef.rootID
      context.emit('changePage', { name, id, data: toRaw(node.dataRef) })
    }

    let handleOk = () => {
      formRef.value.model
        .validate()
        .then(() => {
          treeHandler
            .create({ data: toRaw(entity.value) })
            .then(() => {
              message.success('新建成功')
              formRef.value.model.resetFields()
              modealVisible.value = false
              reset()
            })
            .catch((err) => message.error(err))
        })
        .catch(() => {
          message.error('请认真填写')
        })
    }

    let cancel = () => {
      formRef.value.model.resetFields()
    }

    return {
      selectedKeys,
      cancel,
      entity,
      handleOk,
      formRef,
      updateForm,
      modealVisible,
      showModal,
      treeData,
      onSelect,
      replaceFields,
      loadData,
      reset,
      searchValue,
    }
  },
  props: {
    storeModel: {
      type: String,
      required: true,
    },
    openAll: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => { },
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    col: {
      type: Array,
      required: true,
      default: () => [
        {
          action: 'query',
          name: 'name',
          isLeaf: true,
          type: 'org',
        },
      ],
    }
  },
}
</script>

<style scoped>
.tree {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffff;
}

.treebtns {
  padding: 8px;
  display: flex;
  align-items: center;
}

.treecontent {
  flex: auto;
  overflow: hidden;
  overflow-y: auto;
  /* background-color: #dddddd; */
  padding: 0 5px;
}

@media print {
  .tree {
    display: none;
  }
}
</style>
