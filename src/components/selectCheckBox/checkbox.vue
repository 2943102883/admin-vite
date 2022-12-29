<template>
  <a-dropdown :trigger="['click']">
    <a-button class="ant-dropdown-link m-1" style="color: black" @click.prevent>
      {{ title }}
      <DownOutlined />
    </a-button>
    <template #overlay>
      <a-menu>
        <div :style="{ marginBottom: '10px' }" v-if="searchField">
          <input
            type="text"
            autocomplete="off"
            name="baike-search"
            placeholder="请输入搜索关键词"
            v-model="keyword"
            @keyup.enter="searchEnter(keyword)"
          />
        </div>
        <div :style="{ marginBottom: '5px' }">
          <a-checkbox-group
            style="width:100%"
            v-model:value="checkedList"
            :options="plainOptions" 
            @change="onCheckChange"
          />
        </div>
        <!-- <div :style="{ borderTop: '1px solid #E9E9E9' }">
          <a-checkbox
            v-model:checked="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
        </div> -->
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script>
import { DownOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, reactive, toRefs, watch,toRaw } from "vue";
import { mapActions, useStore } from "vuex";
export default defineComponent({
  components: {
    DownOutlined,
  },
  setup(props, { emit }) {
    const $store = useStore();
    const handle = {
      $store,
      ...mapActions(props.storeModel, ["query"]),
    };
    handle.query({ l: props.limit }).then((res) => {
      if (res) {
        const d = res.data;
        let arr = [];
        for (const e of d) {
          // console.log(e[props.optionField]);
          if (
            Object.prototype.toString.call(e[props.optionField]) ===
            "[object Array]"
          ) {
            // console.log('array');
            if (
              e[props.optionField].length > 0 &&
              Object.prototype.toString.call(e[props.optionField][0]) ===
                "[object String]"
            ) {
              // console.log('string');
              for (let i = 0; i < e[props.optionField].length; i++) {
                const el = e[props.optionField][i];
                if (arr.indexOf(el) === -1) {
                  arr.push(el);
                }
              }
            } else {
              for (let i = 0; i < e[props.optionField].length; i++) {
                const el = e[props.optionField][i];
                if (arr.indexOf(el[props.field]) === -1) {
                  arr.push(el[props.field]);
                }
              }
            }
          } else {
            if (
              e[props.optionField] === "" ||
              arr.indexOf(e[props.optionField]) !== -1
            )
              continue;
            arr.push(e[props.optionField]);
          }
        }
        plainOptions.value = arr;
      }
    });
    const state = reactive({
      indeterminate: false,
      checkAll: false,
      checkedList: [],
    });
    const plainOptions = ref([]);
    const onCheckAllChange = (e) => {
      Object.assign(state, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
      });
      emit("checkAll", state.checkedList);
      emit("update:value",state.checkedList)
      // console.log(state.checkedList);
    };
    const onCheckChange = (e) => {
      emit("checkA", e);
      emit("update:value",e)
      // console.log(e);
    };
    const keyword = ref();
    const searchEnter = (k) => {
      handle
        .query({
          l: props.limit,
          [props.searchField ? props.searchField : props.optionField]: k,
        })
        .then((res) => {
          if (res) {
            const d = res.data;
            const arr = [];
            for (const e of d) {
              if (
                e[props.optionField] === "" ||
                arr.indexOf(e[props.optionField]) !== -1
              )
                continue;
              arr.push(e[props.optionField]);
            }
            plainOptions.value = arr;
          }
        });
    };
    watch(
      () => state.checkedList,
      (val) => {
        state.indeterminate = !!val.length && val.length < plainOptions.length;
        state.checkAll = val.length === plainOptions.length;
      }
    );
    return {
      ...toRefs(state),
      keyword,
      plainOptions,
      onCheckAllChange,
      onCheckChange,
      searchEnter,
    };
  },
  props: {
    // 按钮文本、标题
    title: {
      type: String,
      default: "展开",
    },
    storeModel: {
      type: String,
      default: "User",
      required: true,
    },
    // 获取的条数
    limit: {
      type: [String, Number],
      default: 10,
    },
    // 选项的来自于哪个字段
    optionField: {
      type: String,
      default: "type",
    },
    // 如果是数组对象则需要传入该属性，获取对象的哪一个字段
    field: {
      type: String,
      default: "",
    },
    // 传入该属性则开启搜索功能
    searchField: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="less" scoped>
.m-1 {
  margin: 0 4px;
}
ul{
  padding-inline-start: 0px;
  margin-block-start: 0;
  margin-block-end: 0;
}
:deep(.ant-checkbox-wrapper) {
  width: 100%;
  padding-left: 8px;
  padding-bottom: 4px;
  display: block;
}
:deep(.ant-checkbox-wrapper:hover){
background: #EEE;
}
input {
  outline: none;
  border-radius: 10px;
  text-indent: 1em;
}
</style>
