<template>
  <a-layout class="h-full w-full overflow-hidden flex">
    <a-layout-sider :style="{ background: '#f5f5f5' }">
      <a-menu
        mode="inline"
        :style="{ background: '#f5f5f5' }"
        :inline-collapsed="collapsed"
        v-model:selectedKeys="selectedKeys"
      >
        <template v-for="(item, n) in itemMune" :key="n">
          <template v-if="!item.children || item.children.length == 0">
            <a-menu-item :key="item.name" @click="go(item)">
              <span class="flex items-center">
                <svg-icon
                  :localIcon="item.meta.icon"
                  class="text-[20px]"
                ></svg-icon>
                <span class="nav-text ml-[10px]">{{ item.meta.title }}</span>
              </span>
            </a-menu-item>
          </template>
          <template v-else>
            <a-sub-menu :key="'sub' + n">
              <template #title>
                <span class="flex items-center">
                  <svg-icon
                    :localIcon="item.meta.icon"
                    class="text-[20px]"
                  ></svg-icon>
                  <span class="nav-text ml-[10px]">{{ item.meta.title }}</span>
                </span>
              </template>
              <template v-for="(itemSub, index) in item.children" :key="index">
                <template
                  v-if="!itemSub.children || itemSub.children.length == 0"
                >
                  <a-menu-item
                    style="margin: 0"
                    :key="itemSub.to ? itemSub.to.name : itemSub.text"
                    @click="go(itemSub)"
                  >
                    <span class="flex items-center">
                      <svg-icon
                        :localIcon="itemSub.meta.icon"
                        class="text-[20px]"
                      ></svg-icon>
                      <span class="ml-[10px]">{{ itemSub.meta.title }}</span>
                    </span>
                  </a-menu-item>
                </template>
                <template>
                  <a-sub-menu :key="'secondSub' + index">
                    <template #title>
                      <span>
                        <svg-icon
                          :localIcon="itemSub.meta.icon"
                          class="text-[20px]"
                        ></svg-icon>
                        <span class="nav-text ml-[10px]">{{
                          itemSub.meta.title
                        }}</span>
                      </span>
                    </template>
                    <a-menu-item
                      :style="{ background: '#f5f5f5' }"
                      v-for="secondItemSub in itemSub.children"
                      :key="
                        secondItemSub.to
                          ? secondItemSub.to.name
                          : secondItemSub.text
                      "
                      @click="go(secondItemSub)"
                    >
                      <span class="flex items-center">
                        <svg-icon
                          :localIcon="secondItemSub.meta.icon"
                          class="text-[20px]"
                        ></svg-icon>
                        <span class="ml-[10px]">{{
                          secondItemSub.meta.title
                        }}</span>
                      </span>
                    </a-menu-item>
                  </a-sub-menu>
                </template>
              </template>
            </a-sub-menu>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="h-full overflow-hidden flex-1">
      <transition name="component-fade" mode="out-in">
        <router-view> </router-view>
      </transition>
    </a-layout-content>
  </a-layout>
</template>

<script>
// @ is an alias to /src
const getTreeDataByKey = (childs = [], findKey) => {
  let finditem = null
  for (let i = 0, len = childs.length; i < len; i++) {
    let item = childs[i]
    if (item.children && item.children.length > 0) {
      finditem = getTreeDataByKey(item.children, findKey)
    }
    if (item.to && item.to.name == findKey) {
      finditem = item
    }
    if (finditem != null) {
      break
    }
  }
  return finditem
}
import { defineComponent, reactive, toRefs, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'nav-frame',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const menuList = store.state.Menu.menuList
    const state = reactive({
      selectedKeys: [],
      itemMune: [],
      actRoute: '', //?????????????????????
      actNavRoute: '' //????????????????????????
    })

    const collapsed = ref(false)

    function go(item) {
      if (item.name) {
        router.push({ name: item.name })
      }
    }
    // ????????????????????????????????? selectedKeys
    const bindNavRoute = function () {
      // ??????????????????????????????????????????-1???????????????????????????Mune,???>0???????????????Mune??????????????????nav?????????????????????
      let index = route.matched.findIndex(data => data.name == state.actRoute)
      // ????????????-1????????????????????????????????????
      if (index == -1) {
        checkout()
      } else {
        // ??????????????????????????????????????????????????????????????????????????????-1???????????????????????????????????????
        let navMeun = getTreeDataByKey(menuList, route.name)

        if (navMeun) {
          state.selectedKeys = [route.name]
          state.actNavRoute = route.name
        } else {
          state.selectedKeys = [state.actNavRoute]
        }
      }
    }

    bindNavRoute()
    // ?????????????????????
    function checkout() {
      state.selectedKeys = [route.name]
      let item = {}
      menuList.forEach(data => {
        for (let val of route.matched) {
          if (data.name == val.name) {
            item = data
          }
        }
      })
      if (Object.keys(item).length > 0) {
        state.actRoute = item.name
        state.itemMune = item.children
      }
    }

    // ??????????????????
    watch(
      () => route.name,
      () => {
        bindNavRoute()
      },
      {
        immediate: false,
        deep: false
      }
    )
    // const routeKey=computed(()=>{

    //     return route.name !== undefined
    //     ? route.name + new Date()
    //     : route + new Date();
    //   })
    return {
      // routeKey,
      collapsed,
      go,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
:deep(.ant-menu-submenu > .ant-menu) {
  background-color: #f5f5f5;
}
</style>
