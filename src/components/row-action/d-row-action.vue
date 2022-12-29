<template>
  <div :class="type === 'card' ? 'card' : ''">
    <a-dropdown
      key="more"
      v-if="more"
      class="width-33"
      :trigger="['click']"
      ref="dropdownRef"
      :disabled="isDisabled"
    >
      <slot name="action" :item="item"></slot>
      <a-button
        :style="{
          border: 'none',
          padding: 0,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          fontSize: '20px'
        }"
        :class="{ color: !isDisabled }"
      >
        <MoreOutlined />
      </a-button>
      <template #overlay>
        <a-menu>
          <slot name="actionMore" :item="item"></slot>
          <template v-if="detail">
            <a-menu-item @click="openDetail">
              <a-button type="link" class="ac-btn flex items-center">
                <template #icon>
                  <ProfileOutlined :style="{ color: '#1890ff' }" />
                </template>
                详情
              </a-button>
            </a-menu-item>
          </template>
          <template v-if="edit">
            <a-menu-item @click="openEdit">
              <a-button type="link" class="ac-btn flex items-center">
                <template #icon>
                  <FormOutlined :style="{ color: '#1890ff' }" />
                </template>
                编辑
              </a-button>
            </a-menu-item>
          </template>
          <template v-if="del">
            <a-menu-item @click="openTrash">
              <a-button type="link" class="ac-btn flex items-center">
                <template #icon>
                  <DeleteOutlined :style="{ color: '#ff4949' }" />
                </template>
                删除
              </a-button>
            </a-menu-item>
          </template>
          <slot name="menuActionEnd" :item="item"></slot>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
import { computed, ref, defineComponent, onUpdated, onMounted } from 'vue'

export default defineComponent({
  name: 'd-row-action',
  props: {
    item: {
      type: Object,
      required: true
    },
    detail: {
      type: Boolean,
      default: false
    },
    del: {
      type: Boolean,
      default: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    more: {
      type: Boolean,
      default: true
    },
    type: {
      type: String
    }
  },
  setup(props) {
    let dropdownRef = ref(null)

    const isChildren = rows => {
      let disabled = true

      for (let index = 0; index < rows.length; index++) {
        let row = rows[index]
        if (
          Object.prototype.toString.call(row.children) == '[object Array]' &&
          row.children.length > 0
        ) {
          disabled = false
          return
        }

        if (Object.prototype.toString.call(row.children) == '[object Object]') {
          disabled = false
          return
        }
      }

      return disabled
    }

    let isDisabled = computed(() => {
      let disabled = false
      if (dropdownRef.value) {
        let rows = dropdownRef.value.$slots.overlay()[0].children.default()
        disabled = isChildren(rows)
      }

      return disabled
    })

    return {
      isDisabled,
      dropdownRef
    }
  },
  methods: {
    openDetail() {
      this.$emit('detail', this.item)
    },
    openEdit() {
      this.$emit('edit', this.item)
    },
    openTrash() {
      this.$emit('trash', this.item)
    }
    /*     deleteItem(item) {
          console.log(item)
          Modal.confirm({
            title: '',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确定要删除数据?',
            okText: '确认',
            okButtonProps: { type: "default" },
            cancelText: '取消',
            cancelButtonProps: { type: "primary" },
            onOk: () => {
              this.curd.deleteOne(item);
            }
          });

        }, */
  }
})
</script>

<style lang="less" scoped>
.ac-btn {
  color: black;
  &:hover {
    color: #1890ff;
  }
}
.card-grid {
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
  justify-items: center;
}
.card {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0 !important;
  padding: 0;
}
.width-33 {
  margin: 0 4px;
}
.card .width-33 {
  flex: 1;
  border-right: 1px solid #eee !important;
}
.card .width-33:last-child {
  border-right: none !important;
}
.act:hover {
  color: blue;
}
.color {
  color: #1890ff;
}

.card .tableAction {
  display: none;
}
</style>
