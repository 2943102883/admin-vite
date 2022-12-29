<template>
  <div>
    <div class="d-field-toolbar">
      <div class="d-field-toolbar-filters" v-if="isSearch">
        <a-space>
          <slot name="keyword">
            <a-input-search
              v-model:value="keyword"
              placeholder="关键词查询"
              style="width: 200px"
              @search="search"
            />
            <a-button type="primary" @click="search">查询</a-button>
          </slot>
        </a-space>
      </div>
      <div class="d-field-toolbar-control">
        <a-space>
          <a-button type="primary" @click="create">新建</a-button>
        </a-space>
      </div>
    </div>
    <a-table :data-source="dataSource" bordered>
      <a-table-column
        v-for="(col, idx) in columns"
        :title="col.title"
        :data-index="col.dataIndex"
        :key="col.dataIndex"
        :sorter="col.sorter"
        :width="col.width"
        :align="col.align"
        :ellipsis="col.ellipsis"
        :defaultFilteredValue="col.defaultFilteredValue"
        :defaultSortOrder="col.defaultSortOrder"
        :filtered="col.filtered"
        :filteredValue="col.filteredValue"
        :filters="col.filters"
        :fixed="col.fixed"
      >
        <template #default="{ text, record }">
          <template v-if="editableData[record._key]&& !col.noEdit">
            <a-input
              v-if="col.input === 'input'"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-input-number
              :min="col.min"
              :max="col.max"
              v-else-if="col.input === 'number'"
              :placeholder="col.placeholder"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-switch
              v-else-if="col.input === 'switch'"
              :placeholder="col.placeholder"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-date-picker
              :showTime="col.showTime"
              :format="col.format"
              v-else-if="col.input === 'date-picker'"
              :placeholder="col.placeholder"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-range-picker
              :showTime="col.showTime"
              :format="col.format"
              v-else-if="col.input === 'range-picker'"
              :placeholder="col.placeholder"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-month-picker
              :showTime="col.showTime"
              :format="col.format"
              v-else-if="col.input === 'month-picker'"
              :placeholder="col.placeholder"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-select
              v-else-if="col.input === 'select'"
              :placeholder="col.placeholder"
              :mode="selectMode"
              :labelInValue="selectLabelInValue"
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
            <a-input
              v-else
              v-model:value="editableData[record._key][col.dataIndex]"
              style="margin: -5px 0"
            />
          </template>
          <template v-else>{{text}}</template>
        </template>
      </a-table-column>

      <a-table-column key="_action_" title="操作" width="128px">
        <template #default="{ record }">
          <div class="editable-row-operations">
            <span v-if="editableData[record._key]">
              <a-space>
                <a @click="save(record._key)">保存</a>
                <a @click="cancel(record._key)">取消</a>
              </a-space>
            </span>
            <span v-else>
              <a-space>
                <a-button @click="edit(record._key)" size="small">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
                <a-popconfirm title="确定删除?" @confirm="del(record._key)">
                  <a-button v-if="del" size="small">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </a-popconfirm>
              </a-space>
            </span>
          </div>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>
<script>
import { cloneDeep } from "lodash-es";
import { defineComponent, reactive, ref, watch } from "vue";
export default defineComponent({
  setup(props, context) {
    // const dataModel = ref(props.dataModel);
    // 数据集
    const dataSource = ref();

    // 初始化数据集
    const resetDataSource = (v) => {
      dataSource.value = v;
      if (dataSource.value) {
        for (let i = 0; i < dataSource.value.length; i++) {
          dataSource.value[i]["_key"] = "" + i;
        }
      } else {
        dataSource.value = [];
      }
    };
    resetDataSource(props.value);

    // 数据集变化监听
    watch(
      () => props.value,
      (nv, ov) => {
        resetDataSource(nv);
      }
    );

    // 定义的列
    const columns = props.columns;

    // 正在编辑的数据
    const editableData = reactive({});

    const status = {
      editMode: 0, //编辑状态，0非编辑状态，1，新增状态，2编辑状态
      key: null, //当前编辑的key
    };
    const resetStatus = () => {
      if (status.editMode == 1) {
        dataSource.value.splice(dataSource.value.length - 1, dataSource.value.length);
        status.editMode = 0;
        status.key = null;
      } else if (status.editMode == 2) {
        status.editMode = 0;
        status.key = null;
      }
    };

    // 编辑指定的数据
    const toEdit = (key) => {
      if (status.key) {
        delete editableData[status.key];
      }
      status.key = key;
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => key === item._key)[0]
      );
    };
    // 创建新的空记录
    const create = () => {
      let key = "0";
      console.log(dataSource);
      if (dataSource.value) {
        key = "" + dataSource.value.length;
      }
      dataSource.value.push({ _key: key });
      status.editMode = 1;
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => key === item._key)[0]
      );
      toEdit(key);
    };

    // 编辑指定的数据
    const edit = (key) => {
      status.editMode = 2;
      toEdit(key);
    };

    const save = (key) => {
      console.log(dataSource.value);
      Object.assign(
        dataSource.value.filter((item) => key === item._key)[0],
        editableData[key]
      );
      status.editMode = 0;
      status.key = null;
      delete editableData[key];
      context.emit("update:value", dataSource.value);
    };

    const del = (key) => {
      dataSource.value = dataSource.value.filter((item) => key !== item._key);
      context.emit("update:value", dataSource.value);
    };

    const cancel = (key) => {
      resetStatus();
      delete editableData[key];
    };
    const search = (keyword) => {};

    return {
      dataSource,
      columns,
      editingKey: "",
      editableData,
      create,
      edit,
      save,
      del,
      cancel,
      search,
    };
  },
  props: {
    value: {
      type: Array,
      require: true,
    },
    columns: {
      type: Array,
      require: true,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    del:{
      type: Boolean,
      default: true,
    }
  },
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.d-field-toolbar {
  width: 100%;
  padding: 8px 8px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: tnum;
  position: relative;
  padding: 16px 24px;
  background-color: #fff;
}

.d-field-toolbar-filters {
  display: block;
  float: left;
  margin-bottom: 0;
  padding-right: 12px;
}
.d-field-toolbar-control {
  float: right;
}
</style>
