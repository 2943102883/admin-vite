import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'url'
import DefineOptions from 'unplugin-vue-define-options/vite'

import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import unocss from 'unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite' // 按需加载自定义组件
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import dayjs from 'dayjs'
/** 项目构建时间 */

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const {
    VITE_ICON_PREFFIX,
    VITE_ICON_LOCAL_PREFFIX,
    VITE_APP_TITLE,
    VITE_APP_NAME,
    VITE_PUBLIC_PATH
  } = loadEnv(configEnv.mode, process.cwd())
  console.log('configEnv.mode---', loadEnv(configEnv.mode, process.cwd()))
  const collectionName = VITE_ICON_LOCAL_PREFFIX.replace(
    `${VITE_ICON_PREFFIX}-`,
    ''
  )

  const PROJECT_BUILD_TIME = JSON.stringify(
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  )

  const rootPath = fileURLToPath(new URL('./', import.meta.url))
  const srcPath = `${rootPath}src`
  const localIconPath = `${srcPath}/assets/svg-icon`

  return {
    base: VITE_PUBLIC_PATH,
    minify: 'esbuild',
    define: {
      PROJECT_BUILD_TIME
    },
    server: {
      host: '0.0.0.0',
      open: true,
      port: 9527
    },
    // devServer:{
    //   proxy:{
    //         '/json_demo':{
    //             // 跨域的服务器地址
    //             target: 'https://www.runoob.com/try/ajax/json_demo.json',
    //             // 是否允许跨域
    //             changeOrigin: true,
    //             // 替换掉请求路径的/json_demo“”
    //             pathRewrite:{'^/json_demo': ""}
    //         },
    //     }
    // },
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath
      },
      extensions: ['.json', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    optimizeDeps: {
      //加载的其他资源
      // include: ['ant-design-vue/es/locale/zh_CN']
    },
    plugins: [
      vue(),
      viteCommonjs(),
      DefineOptions(),
      Icons({
        compiler: 'vue3',
        customCollections: {
          [collectionName]: FileSystemIconLoader(localIconPath)
        },
        scale: 1,
        defaultClass: 'inline-block'
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            appName: VITE_APP_NAME,
            appTitle: VITE_APP_TITLE
          }
        }
      }),
      unocss(),
      Components({
        dts: true,
        dirs: ['src/components'], // 按需加载的文件夹
        resolvers: [
          AntDesignVueResolver({
            resolveIcons: true
          }),
          IconsResolver({
            customCollections: [collectionName],
            componentPrefix: VITE_ICON_PREFFIX
          })
        ],
        include: [/\.vue$/, /\.js$/]
      }),
      createSvgIconsPlugin({
        iconDirs: [localIconPath],
        symbolId: `${VITE_ICON_LOCAL_PREFFIX}-[dir]-[name]`,
        inject: 'body-last',
        customDomId: '__SVG_ICON_LOCAL__'
      })

      // visualizer({
      //   gzipSize: true,
      //   brotliSize: true,
      //   open: true
      // })
    ],
    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       additionalData: `@use "./src/styles/scss/global.scss" as *;`
    //     }
    //   }
    // },
    build: {
      reportCompressedSize: false,
      sourcemap: true,
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  }
})
