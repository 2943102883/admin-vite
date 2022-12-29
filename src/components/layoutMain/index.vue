<template>
  <!-- 主界面框架 -->
  <a-layout class="h-full w-full flex">
    <!-- 左侧模块导航栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsedWidth="48"
      width="235"
      class="custom-sider h-full overflow-auto"
      collapsible
    >
      <div class="flex flex-col h-full justify-between">
        <div class="topMenu">
          <div
            class="justify-center d-flex pt-[24px] pl-[14px] items-center pb-[28px] pr-[14px]"
          >
            <img src="../../assets/image/logo.png" class="w-[28px] h-[28px]" />
            <p
              v-if="collapsed != true"
              class="mb-0 text-[16px] pl-[8px] text-white font-medium"
            >
              {{ systemName }}
            </p>
          </div>

          <a-menu
            theme="dark"
            mode="inline"
            class="sider-menu"
            :openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            @openChange="onOpenChange"
          >
            <template v-for="item in menuLinsName" :key="item.key">
              <template v-if="!item.children">
                <a-menu-item
                  @click="go(item)"
                  :key="item.name"
                  v-if="!item.meta.isHide"
                >
                  <template #icon>
                    <svg-icon
                      :local-icon="item.meta.icon"
                      class="!text-[20px]"
                    ></svg-icon>
                  </template>
                  <span>{{ item.meta.title }}</span>
                </a-menu-item>
              </template>
              <template v-else>
                <a-sub-menu
                  :class="
                    item.name === actRoute ? 'ant-menu-item-selected' : ''
                  "
                  :key="item.name"
                >
                  <template #icon>
                    <svg-icon
                      :local-icon="item.meta.icon"
                      class="!text-[20px]"
                    ></svg-icon>
                  </template>
                  <template #title> {{ item.meta.title }}</template>
                  <template
                    v-for="(itemSub, index) in item.children"
                    :key="index"
                  >
                    <template
                      v-if="!itemSub.children || itemSub.children.length == 0"
                    >
                      <a-menu-item
                        :key="itemSub.name"
                        @click="go(itemSub)"
                        class="!m-0"
                      >
                        <span class="flex items-center">
                          <svg-icon
                            :local-icon="itemSub.meta.icon"
                            class="text-[20px]"
                          ></svg-icon>
                          <span class="ml-[10px]">{{
                            itemSub.meta.title
                          }}</span>
                        </span>
                      </a-menu-item>
                    </template>
                    <template>
                      <a-sub-menu :key="'secondSub' + index">
                        <template #title>
                          <span>
                            <svg-icon
                              :local-icon="itemSub.meta.icon"
                              class="text-[20px]"
                            ></svg-icon>
                            <span class="nav-text">{{
                              itemSub.meta.title
                            }}</span>
                          </span>
                        </template>
                        <a-menu-item
                          :style="{ background: '#f5f5f5' }"
                          v-for="secondItemSub in itemSub.children"
                          :key="secondItemSub.name"
                          @click="go(secondItemSub)"
                        >
                          <span class="flex items-center">
                            <svg-icon
                              :local-icon="secondItemSub.meta.icon"
                              :icon="secondItemSub.meta.icon"
                              class="text-[20px]"
                            ></svg-icon>

                            <span>{{ secondItemSub.meta.title }}</span>
                          </span>
                        </a-menu-item>
                      </a-sub-menu>
                    </template>
                  </template>
                </a-sub-menu>
              </template>
            </template>
          </a-menu>
        </div>

        <div class="bottomMenu">
          <div>
            <a-menu
              theme="dark"
              mode="inline"
              class="sider-menu"
              v-model:selectedKeys="selectedKeys"
            >
              <template v-for="item in menuBaseName">
                <a-menu-item
                  :key="item.name"
                  class="px-6"
                  @click="go(item)"
                  v-if="!item.meta.isHide"
                >
                  <template #icon>
                    <svg-icon
                      :local-icon="item.meta.icon"
                      class="!text-[20px]"
                    ></svg-icon>
                  </template>
                  <span>{{ item.meta.title }}</span>
                </a-menu-item>
              </template>
            </a-menu>
          </div>
          <div class="flex mb-3 cursor-pointer">
            <a-dropdown placement="topCenter">
              <a-avatar
                alt="头像"
                :style="{ margin: '0 auto' }"
                :size="36"
                :src="userAvatarSrc"
              />

              <template #overlay>
                <a-menu mode="vertical">
                  <a-menu-item key="1" @click="go({ name: 'UserPersonal' })"
                    >个人信息</a-menu-item
                  >

                  <a-menu-divider />
                  <a-menu-item key="2" @click="logout">退出</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </a-layout-sider>
    <a-layout class="flex-1">
      <!-- 主工作区 -->
      <a-layout-content :style="{ overflow: 'hidden', height: '100vh' }">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { useRoute, useRouter } from 'vue-router'
import { userModuleAvatar } from '@/store/modules/user/api'
import { useStore, mapMutations, mapGetters } from 'vuex'
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue'

// @ is an alias to /src
const getTreeDataByKey = (childs = [], findKey) => {
  let findItem = null
  for (let i = 0, len = childs.length; i < len; i++) {
    let item = childs[i]
    if (item.children && item.children.length > 0) {
      findItem = getTreeDataByKey(item.children, findKey)
    }
    if (item.to && item.to.name == findKey) {
      findItem = item
    }
    if (findItem != null) {
      break
    }
  }
  return findItem
}
export default defineComponent({
  name: 'layoutMain',
  setup() {
    const router = useRouter()
    const $store = useStore()
    let { logout } = mapMutations('User', ['logout'])

    let handle = {
      $store,
      ...mapGetters('User', ['userInfo']),
      ...mapGetters('Menu', ['menuList'])
    }

    let user = handle.userInfo()

    const systemName = import.meta.env.VITE_APP_TITLE
    const collapsed = ref(false)
    const route = useRoute()
    const state = reactive({
      selectedKeys: [],
      rootSubmenuKeys: [],
      itemMenu: [],
      actRoute: '', //最高级当前菜单
      actNavRoute: '' //第二级当前菜单栏
    })
    const base = ['System', 'User']
    const menuList = $store.state.Menu.menuList
    state.rootSubmenuKeys = menuList.map(item => item.name)

    // 获取基础功能和用户meun
    const getMenuBase = () => {
      return menuList.filter(data => base.includes(data.name))
    }

    // 获取正常menu
    const getMenuList = () => {
      return menuList.filter(data => !base.includes(data.name))
    }
    // 跟踪路由变化绑定当前项 selectedKeys
    const bindNavRoute = function () {
      // 监听最高级路由是否发生变化，-1为变化，需重新加载Mune,为>0时不需要加Mune，只需要判断nav子菜单的当前项
      let index = route.matched.findIndex(data => data.name == state.actRoute)
      // 如果不为-1，说明最高级菜单还没切换
      if (index == -1) {
        checkout()
      } else {
        // 判断路由变化后的路由是否为当前路由下的子路由，不是为-1，是就不改变当前菜单选中项
        let navMenu = getTreeDataByKey(menuList, route.name)

        if (navMenu) {
          state.selectedKeys = [route.name]
          state.actNavRoute = route.name
        } else {
          state.selectedKeys = [state.actNavRoute]
        }
      }
    }

    bindNavRoute()
    // 最高级菜单切换
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
        state.itemMenu = item.children
      }
    }

    // 监听路由变化
    watch(
      () => route.name,
      () => {
        bindNavRoute()
        console.log('selectedKeys', state.selectedKeys)
        console.log('openKeys', state.openKeys)
      },
      {
        immediate: false,
        deep: false
      }
    )
    const userAvatarSrc = computed(() => {
      if (user.avatar && user.avatar.id) {
        return userModuleAvatar(user.avatar.id, 'small')
      } else {
        return ''
      }
    })
    // 导航
    function go(item) {
      if (item.name) {
        router.push({ name: item.name })
      }
    }

    let openKeys = ref([])

    const onOpenChange = openMenuKeys => {
      const latestOpenKey = openMenuKeys.find(
        key => openKeys.value.indexOf(key) === -1
      )

      if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        openKeys.value = openMenuKeys
      } else {
        openKeys.value = latestOpenKey ? [latestOpenKey] : []
      }
      console.log('openMenuKeys', openMenuKeys)
    }

    const menuBaseName = ref(getMenuBase())
    const menuLinsName = ref(getMenuList())
    return {
      menuList,
      userAvatarSrc,
      onOpenChange,
      ...toRefs(state),
      go,
      openKeys,
      logout,
      menuBaseName,
      menuLinsName,
      systemName,
      collapsed
    }
  }
})
</script>
<style scoped>
.logo {
  margin: 16px 0;
  align-content: center;
}

.site-layout .site-layout-background {
  background: #fff;
}

.sider-menu.ant-menu-inline-collapsed {
  width: 48px;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

.flex-column {
  flex-direction: column;
}

.align-center {
  align-content: center;
}

.justify-center {
  justify-content: center;
}

.justify-space-between {
  justify-content: space-between;
}

.flex-grow-1 {
  flex-grow: 1;
}

.flex-column-to {
  flex-direction: column;
}

:deep(.sider-menu.ant-menu-inline-collapsed
    > .ant-menu-submenu
    > .ant-menu-submenu-title) {
  margin-bottom: 0 !important;
}

:deep(.sider-menu .ant-menu-item-icon) {
  font-size: 20px !important;
}

:deep(.sider-menu.ant-menu-inline-collapsed > .ant-menu-item) {
  padding: 0 16px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-sider::-webkit-scrollbar {
  width: 1px;
  /*height: 4px;*/
}

.custom-sider::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.custom-sider::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

@media print {
  :deep(.ant-layout-sider) {
    display: none;
  }
}
</style>
