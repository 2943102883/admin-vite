<template>
  <a-card size="small">
    <template #title>{{ cardTitle }}</template>
    <template #extra>
      <a-range-picker
        v-model:value="searchTime"
        :show-time="{ format: 'HH:mm' }"
        format="YYYY-MM-DD HH:mm"
        :placeholder="['开始时间', '结束时间']"
        @ok="onOk"
      />
    </template>
    <a-skeleton :loading="loading">
      <line-chart
        v-for="row in lineData"
        :key="row.key"
        :data="row.data"
        class="mb-3 p-3"
      ></line-chart>
      <a-empty v-if="!lineData.length" />
    </a-skeleton>
  </a-card>
</template>
<script>
import { onMounted, reactive, watch, ref, defineComponent } from 'vue'
import { mapActions, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { moment } from '@/utils/filters'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    cardTitle: {
      type: String,
      default: '监测数据'
    },
    storeModel: {
      type: [String, Object],
      required: true
    }
  },
  setup(props) {
    const $store = useStore()
    const loading = ref(true)
    const searchTime = ref([])
    const lineData = ref([])

    const dom = ref([])

    const handler = {
      // 映射到store的方法
      $store,
      ...mapActions(props.storeModel, ['queryData'])
    }

    const toLine = rows => {
      let Data = []
      let tempObj = {}

      rows.forEach(row => {
        let time = moment(row.time).format('YYYY-MM-DD HH:mm')
        row.data.forEach(item => {
          //    {
          //   "key": "ec",
          //   "label": "电导率",
          //   "sort": 1,
          //   "valueType": "",
          //   "value": "100",
          //   "sourceGuid": ""
          // },

          if (!tempObj[item.key]) {
            tempObj[item.key] = []
          }

          tempObj[item.key].push({
            label: item.label,
            value: item.value,
            time
          })
        })
      })

      Object.entries(tempObj).forEach(([key, data]) => {
        Data.push({ key, data })
      })

      lineData.value = Data

      loading.value = false
    }

    const queryData = () => {
      handler
        .queryData({
          id: props.id,
          params: {
            skip: 0,
            startTime: searchTime.value[0].format(),
            endTime: searchTime.value[1].format()
          }
        })
        .then(res => {
          if (res.data && res.data.length) {
            toLine(res.data)
          } else {
            loading.value = false
          }
        })
        .catch(error => {
          loading.value = false
        })
    }

    const onChangeTime = () => {
      console.log('onChangeTime')
    }
    const onOk = () => {
      queryData()
    }

    onMounted(() => {
      searchTime.value = [moment().startOf('day'), moment().endOf('day')]
      queryData()
    })

    watch(
      () => props.id,
      id => {
        if (id) {
          queryData()
        }
      }
    )

    return {
      loading,
      searchTime,
      lineData,
      onOk,
      onChangeTime
    }
  }
}
</script>
