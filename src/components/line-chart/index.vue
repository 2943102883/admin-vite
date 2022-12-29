<template>
  <div :id="lineRef" class="w-full h-[200px]"></div>
</template>
<script>
import { onMounted, reactive, watch, ref, defineComponent } from 'vue'
import { Line } from '@antv/g2plot'

export default {
  props: {
    data: {
      type: [Array],
      required: () => []
    }
  },
  setup(props) {
    const loading = ref(true)
    const lineChart = ref()
    const lineRef = ref('line_' + Math.random())
    let lineConfig = {
      data: [],
      xField: 'time',
      yField: 'value',
      seriesField: 'label',
      yAxis: {
        // label: {
        //   formatter: v => `${(v / 10e8).toFixed(1)} B`
        // }
      },
      xAxis: {
        // type: 'timeCat',
        // tickCount: 2
      },
      legend: {
        position: 'top'
      },
      color: '#a8ddb5',
      smooth: true,
      // @TODO 后续会换一种动画方式
      animation: {
        appear: {
          animation: 'path-in',
          duration: 5000
        }
      }
    }

    const renderLineChart = () => {
      if (!lineRef.value) return
      lineConfig.data = props.data

      lineChart.value = new Line(lineRef.value, lineConfig)

      lineChart.value.render()
    }

    onMounted(() => {
      renderLineChart()
    })

    watch(
      () => props.data,
      data => {
        if (data && data.length) {
          lineConfig.data = data
          lineChart.value.update({
            ...lineConfig,
            legend: false
          })
        }
      }
    )

    return {
      lineRef
    }
  }
}
</script>
