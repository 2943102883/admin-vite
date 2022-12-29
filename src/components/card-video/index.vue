<template>
  <a-card size="small" :loading="loading">
    <template #title>
      <slot name="cardTitle">
        <a>{{ title }} </a>
      </slot>
    </template>

    <div class="w-full" id="video-container"></div>
  </a-card>
</template>
<script>
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import EZUIKit from 'ezuikit-js'
export default defineComponent({
  name: 'card-video',
  props: {
    title: {
      type: String,
      default: '视频监控'
    },
    videoSrc: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    let player = null

    const init = () => {
      player = new EZUIKit.EZUIKitPlayer({
        id: 'video-container', // 视频容器ID
        accessToken: props.accessToken,
        url: props.videoSrc
      })

      window.player = player
      // player.value = new EZUIKit.EZUIKitPlayer('myPlayer')

      // player.stop()
    }

    const fullScreen = () => {
      player.fullScreen()
    }

    watch(
      () => props.videoSrc,
      videoSrc => {
        if (videoSrc) {
          if (player) {
            player.stop().then(() => {
              player.play({
                url: videoSrc
              })
            })
          } else init()
        }
      },
      {
        immediate: true
      }
    )

    onBeforeUnmount(() => {
      if (player) {
        player.stop().then(() => {
          player.destroy().then(() => {
            player = null
            window.player = null
          })
        })
      }
    })

    return {}
  }
})
</script>
