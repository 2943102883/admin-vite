<template>
  <div class="treeleft">
    <div class="treebtns !bg-white">
       <a-space>
      <a-button type="primary" @click="create.modal = true"
        ><span>新增目录</span></a-button
      >
      <a-button type="link" @click="Load();expandedKeys=[]" class="flex">
        <template #icon
          ><SyncOutlined
            :style="{ fontSize: '22px' }" /></template
      ></a-button>
      </a-space>

    </div>
    <div class="border-t border-gray-200 w-full"></div>
    <div class="treecontent">
      <div class="load">
        <a-spin v-if="loading" />
        <a-empty v-if="!loading&&treeData.length==0"/>
      </div>
      <a-directory-tree
        :tree-data="treeData"
        :load-data="onLoadData"
        :replaceFields="{ title: 'name', key: 'id' }"
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:loadedKeys="loadedKeys"
        @select="onSelect"
        :blockNode="false"
      >
        <template #title="{ id: treeKey, name }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ name }}</span>
            <template #overlay>
              <a-menu
                @click="
                  ({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)
                "
              >
                <a-menu-item key="addParent" style="padding: 12px 28px"
                  >新键下级</a-menu-item
                >
                <a-menu-item key="edit" style="padding: 12px 28px"
                  >编辑</a-menu-item
                >
                <a-menu-item
                  key="refresh"
                  style="padding: 12px 28px; border-bottom: 1px solid #eee"
                  >刷新</a-menu-item
                >
                <a-menu-item key="deletet" style="padding: 12px 28px"
                  >删除</a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-directory-tree>
    </div>
    <my-modal
      v-model:visible="create.modal"
      v-model:processing="create.processing"
      :error="create.error"
      :errorMessage="create.errorMessage"
      @confirm="submitCreate"
      title="添加目录"
      :parents="onContextTreeParent"
      :key="create.id"
    />
    <my-modal
      v-model:visible="edits.modal"
      v-model:processing="edits.processing"
      :error="edits.error"
      :errorMessage="edits.errorMessage"
      @confirm="submitEdit"
      title="编辑"
      :parents="onContextTreeParent"
      :value="edits.value"
      :key="edits.value"
    />
  </div>
</template>
<script>
import { defineComponent, watch, ref, reactive, createVNode,onMounted } from "vue";
import { mapActions, useStore } from "vuex";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import MyModal from "./modal.vue";
// 根据key获取与之相等的数据对象
const getTreeDataByKey = (childs = [], findKey) => {
  let finditem = null;
  for (let i = 0, len = childs.length; i < len; i++) {
    let item = childs[i];
    if (item.id !== findKey && item.children && item.children.length > 0) {
      finditem = getTreeDataByKey(item.children, findKey);
    }
    if (item.id == findKey) {
      finditem = item;
    }
    if (finditem != null) {
      break;
    }
  }
  return finditem;
};
// 根据key获取父级节点children数组
const getTreeParentChilds = (childs = [], findKey) => {
  let parentChilds = []
   for (let i = 0, len = childs.length; i < len; i++) {
     let item = childs[i]
     if (item.id !== findKey && item.children && item.children.length > 0) {
       parentChilds = getTreeParentChilds(item.children, findKey)
     }
     if (item.id == findKey) {
       parentChilds = childs
     }
     if (parentChilds.length > 0) {
       break
     }
   }
   return parentChilds
};
// 根据key获取所有的父节点
const getTreeParents = (childs = [], findKey) => {
  var arrRes = [];
  if (childs.length == 0) {
    if (!!findKey) {
      arrRes.unshift(childs);
    }
    return arrRes;
  }
  let rev = (data, nodeId) => {
    for (var i = 0, length = data.length; i < length; i++) {
      let node = data[i];
      if (node.id == nodeId) {
        const {id,name,code,description}=node
        arrRes.unshift({id,name,code,description});
        rev(childs, node.parent);
        break;
      } else {
        if (!!node.children) {
          rev(node.children, nodeId);
        }
      }
    }
    return arrRes;
  };
  arrRes = rev(childs, findKey);
  return arrRes;
};
export default defineComponent({
  components: {
    MyModal,
  },
  setup(props, context) {
    const treeData = ref([]);
    const reoacd = ref({});
    const loadedKeys=ref([])
    const $store = useStore();
    const handler = {
      $store,
      ...mapActions("Category", [
        "createModule",
        "updateModule",
        "queryModule",
        "deleteModule",
      ]),
    };
    // 当前菜单 所有父级
    const onContextTreeParent=ref([])
    // 点击头部新增
    const addParentGogle = () => {
      create.visible = true;
      onContextTreeParent.value=[]
    };

    // 全局刷新
    const loading=ref(true)
    const Load = () => {
      loading.value=true
      loadedKeys.value=[]
      handler
        .queryModule({ module: props.storeModel, params: { o: "-_id" } })
        .then((res) => {
          treeData.value = res.data;
          loading.value=false
        });
    };
    onMounted(()=>{
      Load()
    })

    // 删除
    const rmTree = (id) => {
      Modal.confirm({
        title: "",
        icon: createVNode(ExclamationCircleOutlined),
        content: "确定要删除数据?",
        okText: "确认",
        okButtonProps: { type: "default" },
        cancelText: "取消",
        cancelButtonProps: { type: "primary" },
        onOk: () => {
          handler.deleteModule({ module: props.storeModel, id }).then(() => {
            let parentChilds = getTreeParentChilds(treeData.value, id);
            let delIndex = parentChilds.findIndex((item) => item.id == id);
            parentChilds.splice(delIndex, 1);
            message.info("删除成功");
          });
        },
      });
    };
    // 公共分类
    /*  const publicm={
      query:()=>{
        
      }
    }

    publicm.query() */

    //菜单操作
    const addParent = (treeKey) => {
      create.id = treeKey;
      onContextTreeParent.value=getTreeParents(treeData.value,treeKey)
      create.modal = true;
    };
    const edit = (treeKey) => {
      const keyTree = getTreeDataByKey(treeData.value, treeKey);
      onContextTreeParent.value=getTreeParents(treeData.value,treeKey)
      edits.modal = true;
      edits.value = keyTree;
    };
    const refresh = (treeKey) => {
      let index = loadedKeys.value.indexOf(treeKey)
      if(index>-1){
        loadedKeys.value.splice(index,1)
      }
      const keyTree = getTreeDataByKey(treeData.value, treeKey);
      if(keyTree.children){
        keyTree.children.forEach(data => {
          index=loadedKeys.value.indexOf(data.id)
          if(index>-1){
            loadedKeys.value.splice(index,1)
          }
          index=expandedKeys.value.indexOf(data.id)
          if(index>-1){
            expandedKeys.value.splice(index,1)
          }
        });
      }
      index=expandedKeys.value.indexOf(treeKey)
      if(index>-1){
        expandedKeys.value.splice(index,1)
      }
    };
    const deletet = (treeKey) => {
      rmTree(treeKey);
    };
    // 点击右键菜单
    const onContextMenuClick = (treeKey, menuKey) => {
      console.log(menuKey);
      function getTranslationMap(rhyme) {


        const rhymes = {
          addParent,
          edit,
          refresh,
          deletet,
        };
        rhymes[rhyme](treeKey);
      }
      getTranslationMap(menuKey);
    };
    const expandedKeys = ref([""]);

    watch(expandedKeys, () => {
      context.emit("expanded", expandedKeys);
    });

    const onSelect = (selectedKeys, e) => {
      const selectedParent=getTreeParents(treeData.value,selectedKeys[0])
      context.emit("select", selectedKeys,selectedParent, e);
    };
    // 新键
    const create = reactive({
      id: "",
      modal: false,
      processing: false,
    });
    // 创建树 data可以为公共类，可为下级，公共类data 需传parent属性
    const createTree = (data) => {
      create.processing = true;
      handler.createModule({ module: props.storeModel, data }).then((res) => {
        console.log(res);
        if (res.parent) {
          const keyTree = getTreeDataByKey(treeData.value, res.parent);
          if (!keyTree.children) {
            keyTree.children = [];
          }
          keyTree.children.push(res);
        } else {
          treeData.value.push(res);
        }
        message.info("创建成功");
        create.processing = false;
        create.modal = false;
        create.id = "";
      });
    };
    const submitCreate = (formData) => {
      let data = { ...formData, parent: create.id };
      createTree(data);
    };
    const submitGogal = (data) => {
      create.id = "";
      createTree(data);
    };
    // 编辑
    const edits = reactive({
      modal: false,
      processing: false,
      value: {},
    });
    const submitEdit = (datas) => {
      edits.processing = true;
      handler
        .updateModule({ module: props.storeModel, data:{...datas,parent:edits.value.parent}, id: edits.value.id })
        .then((res) => {
          const keyTree = getTreeDataByKey(treeData.value, edits.value.id);
          keyTree.name = datas.name;
          keyTree.code = datas.code;
          edits.modal = false;
          edits.processing = false;
          edits.value = {};
        });
    };
    //ajax异步获取子目录
    const onLoadData = (treeNode) => {
      return handler
        .queryModule({
          module: props.storeModel,
          params: { o: "-_id", parent: treeNode.eventKey },
        })
        .then((res) => {
          loadedKeys.value.push(treeNode.eventKey)
          if(res.total!=0){
            const node = getTreeDataByKey(treeData.value, treeNode.eventKey);
            node.children = res.data;
          }
        });
    };

    return {
      treeData,
      onContextMenuClick,
      expandedKeys,
      loadedKeys,
      onLoadData,
      onSelect,
      Load,
      reoacd,
      loading,
      //
      create,
      addParentGogle,
      submitCreate,
      //
      submitGogal,
      onContextTreeParent,
      //
      edits,
      submitEdit,
    };
  },
  props: {
    storeModel: {
      type: String,
      required: true,
    },
  },
});
</script>
<style scoped>
.treeleft {
  width: 250px;
  height: 100%;
 background-color: #FFFFFF
}
.treeright {
  background-color: #dddd;
  flex: auto;
  margin-left: 10px;
}
.treebtns {

  padding: 8px;
  display: flex;
  align-items: center;
}
.treecontent {
  height: calc(100% - 48px);
  flex: auto;
  overflow-y: auto;
}
.load{
  display: flex;
  justify-content: center;
}
</style>