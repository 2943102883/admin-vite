import { createApp } from 'vue'
// import http from '@/lib/http'
import { setupDirectives } from './directives'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/styles/global.css'
import '@/styles/atomleaf.less'
import 'virtual:svg-icons-register'
import 'ant-design-vue/es/message/style/css'

import 'uno.css'
const app = createApp(App)

app.config.globalProperties.$baseUrl = import.meta.env.VITE_API_PATH

setupDirectives(app)
app.use(router)
app.use(store)
app.mount('#app')
