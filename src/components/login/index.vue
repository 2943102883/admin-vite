<template>
  <div class="login_box flex justify-center items-center relative">
    <div class="login-form flex justify-end items-center">
      <div class="form w-[358px] text-center mr-[128px]">
        <p class="text-[30px] text-[#484848] font-bold my-10">
          {{ systemName }}
        </p>
        <a-form
          ref="formRef"
          hideRequiredMark
          :model="formState"
          :rules="rules"
          :wrapper-col="wrapperCol"
          class="mt-[44px]"
        >
          <a-form-item name="user">
            <a-input
              class="w-full"
              placeholder="请输入用户名"
              v-model:value="formState.user"
            >
              <template #prefix>
                <UserOutlined class="mr-[8px] text-lg text-[#16B988]" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input
              class="w-full"
              v-model:value="formState.password"
              placeholder="请输入密码"
              type="password"
            >
              <template #prefix>
                <LockOutlined class="mr-[8px] text-lg text-[#16B988]" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              block
              @click="onSubmit"
              :loading="loading"
              class="login-btn"
              size="large"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, computed } from 'vue'
import { mapActions, useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    bgImgUrl: {
      type: String
    },
    bgColor1: {
      type: String,
      default: '#40A9FF'
    },
    bgColor2: {
      type: String,
      default: '#364D79'
    },
    gradient: {
      type: Boolean,
      default: true
    },
    deg: {
      type: String,
      default: '0deg'
    },
    title: {
      type: String,
      default: ''
    },
    toPath: {
      type: String,
      default: 'HomeIndex'
    }
  },
  setup(props) {
    const $store = useStore()
    const router = useRouter()

    // console.log(imgSrc);
    const loading = ref(false)
    const formRef = ref()
    const systemName = ref('')

    onMounted(() => {
      window.addEventListener('keydown', clickEnter)
    })
    const clickEnter = e => {
      if (e.keyCode == 13) {
        onSubmit()
      }
    }
    const handler = {
      $store,
      ...mapActions('User', ['doLogin', 'logout'])
    }
    const formState = reactive({
      user: 'admin',
      password: '123456'
    })
    const rules = {
      user: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'change'
        }
      ],
      password: [
        {
          required: true,
          message: '请输入用户密码',
          trigger: 'change'
        }
      ]
    }
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          handleLogin()
        })
        .catch(error => {
          console.log('error', error)
        })
    }

    const handleLogin = () => {
      loading.value = true
      const user = formState.user.trim()
      const pass = formState.password.trim()

      handler
        .doLogin({ user, pass, type: 'admin' })
        .then(() => {
          loading.value = false
          router.push({ name: props.toPath })
        })
        .catch(() => {
          message.error('密码错误')
          loading.value = false
        })
    }

    systemName.value = import.meta.env.VITE_APP_TITLE

    return {
      formRef,
      loading,
      formState,
      rules,
      systemName,

      wrapperCol: {
        span: 24
      },
      //方法
      onSubmit
    }
  }
})
</script>
<style scoped lang="less">
.login_box {
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: url(../../../public/loginpagesbg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}
.login-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 1400px;
  height: 748px;
  background-image: url(../../../public/login.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>
