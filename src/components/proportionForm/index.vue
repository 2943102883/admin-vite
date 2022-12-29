<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <Header title="学校报名统计" :dellButton="false" class="!m-0 flex-ground-0">
      <template #headTitle>
        <div class="flex items-center">
          <component
            :is="'IconTgReportForm'"
            :style="{ fontSize: '20px', color: '#1890ff' }"
          ></component>
          <h3 class="text-lg m-0 ml-2">统计报表</h3>
        </div>
      </template>
      <template #control>
        <a-button type="primary" @click="print">打印</a-button>
        <a-button @click="exportExcel">
          <ExportOutlined />
          导出
        </a-button>
      </template>
    </Header>
    <div class="mt-2 flex-1 overflow-auto bg-white noScroll">
      <a-spin :spinning="spinning" class="w-full h-full">
        <h2 class="my-2 text-center flex justify-center items-center">
          特色课程{{ type === 'school' ? '学校' : '机构'
          }}{{ isFinance ? '收费' : '报名' }}统计
          <a-select
            v-model:value="term"
            placeholder="请选择学期"
            class="w-[180px] ml-3"
            @change="termChange"
          >
            <a-select-option
              :value="Opt.id"
              v-for="Opt in termOpt"
              :key="Opt.id"
            >
              {{ Opt.title }}
            </a-select-option>
          </a-select>
          <a-button class="ml-2" type="primary" @click="termChange(term)">
            刷新
          </a-button>
        </h2>
        <a-divider class="mt-0 mb-3" />
        <div style="height: 80vh">
          <!-- :merge-cells="mergeCells" -->
          <vxe-table
            ref="vxeTable"
            size="medium"
            align="center"
            :data="tableData"
            :row-config="{ isHover: true }"
            border
            auto-resize
            show-footer
            :footer-method="footerHandler"
            :footer-span-method="footerRowspanMethod"
            max-height="100%"
            @headerCellClick="colShrinkHandler"
            :span-method="mergeRowMethod"
          >
            <vxe-column
              :title="type === 'school' ? '学校名称' : '机构名称'"
              field="firstName"
              width="140"
            ></vxe-column>
            <vxe-column
              :title="type === 'school' ? '机构名称' : '学校名称'"
              field="secondName"
              width="140"
            ></vxe-column>
            <template
              v-for="classInfo in tableHeader"
              :key="classInfo.category"
            >
              <vxe-colgroup
                :title="classInfo.categoryName + '(大类)'"
                width="140"
                :field="classInfo.category"
              >
                <template #header>
                  <div :class="getCursor(classInfo)">
                    <div>{{ classInfo.categoryName + '(大类)' }}</div>
                    <div class="ml-2" v-if="showIcon(classInfo)">
                      <template v-if="getIcon(classInfo)">
                        <minus-square-outlined />
                      </template>
                      <template v-else>
                        <plus-square-outlined />
                      </template>
                    </div>
                  </div>
                </template>
                <template
                  v-for="item in classInfo.children"
                  :key="item.category"
                >
                  <vxe-column
                    :title="item.categoryName"
                    :field="item.category"
                    width="140"
                  ></vxe-column>
                </template>
              </vxe-colgroup>
            </template>
            <vxe-column field="total" width="140" title="合计"></vxe-column>
          </vxe-table>
        </div>
      </a-spin>
    </div>
  </div>
</template>
<script>
import Header from '@/components/header/header.vue'
import { ref, onMounted, createVNode } from 'vue'
import { mapActions, useStore } from 'vuex'
import { data } from './mock'
import { Modal, message } from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  plusSquareOutlined,
  minusSquareOutlined
} from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'

export default {
  components: { Header, plusSquareOutlined, minusSquareOutlined },
  props: {
    storeModel: {
      type: [String, Object],
      required: true
    },
    type: {
      // school与org
      type: String,
      required: true
    },
    isFinance: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const vxeTable = ref(null)
    const $store = useStore()
    const handler = {
      $store,
      ...mapActions(props.storeModel, [
        'school',
        'org',
        'schoolDownloadFile',
        'orgDownloadFile',
        'schoolPriceDownloadFile',
        'orgPriceDownloadFile'
      ]),
      ...mapActions('Administer', ['getTerm'])
    }
    let termOpt = ref([]) // 学期
    let term = ref() // 默认学期
    let spinning = ref(false) // 加载
    const tableData = ref([]) // 表格数据源
    const tableHeader = ref([]) // 表头
    const tableHeader2 = ref([]) // 表头，备份
    const mergeCells = ref([]) // 合并单元格
    const colShrinkData = ref({}) // 伸缩列数据
    let colShrinkFlag = true // 点击表头收缩的锁
    onMounted(() => {
      getTerm()
    })
    const getTerm = () => {
      // 获取学期数据
      handler.getTerm({ o: '-_id' }).then(res => {
        if (res.data) {
          termOpt.value = res.data
          term.value = res.data[0].id
          queryTable(term.value)
        }
      })
    }
    const queryTable = async id => {
      // 获取表单数据
      spinning.value = true
      let res = await handler[props.type]({ termId: id })
      if (res.data && res.data.length > 0) {
        tableHeader.value = res.data[0].orgSummary
          ? res.data[0].orgSummary[0].categorySummary
          : res.data[0].schoolSummary[0].categorySummary
        res.data = res.data.filter(item =>
          item.schoolId ? item.schoolId : item.orgId
        ) // 验证是否有id，没有的话证明是旧数据
        toTableData(res.data)
        // tableHeader.value = data.data[0].orgSummary
        //   ? data.data[0].orgSummary[0].categorySummary
        //   : data.data[0].schoolSummary[0].categorySummary
        // data.data = data.data.filter(item => item.schoolId ? item.schoolId : item.orgId) // 验证是否有id，没有的话证明是旧数据
        // toTableData(data.data)

        tableHeader2.value = cloneDeep(tableHeader.value) // 备份表头
        let tempHeader = cloneDeep(tableHeader.value)
        tempHeader.forEach(item => {
          // 超过2列的收缩
          if (item.children !== null && item.children.length >= 2) {
            item.children = item.children.slice(0, 2)
            item.isClose = true
          }
        })
        tableHeader.value = tempHeader
        vxeTable.value.loadData(tableData.value) // 重新加载数据
      } else {
        spinning.value = false
      }
    }
    const toTableData = data => {
      // 表格数据
      let tData = [] // 表格数据
      let cell = [] // 表格配置
      let rowNumber = 0 // 行数，表格一个占4行，那么下一个就需要从第5行开始计算
      let colShrink = {} // 伸缩列数据
      data.forEach((classInfo, index) => {
        const firstName = classInfo.schoolName
          ? classInfo.schoolName
          : classInfo.orgName
        const summary = classInfo.orgSummary
          ? classInfo.orgSummary
          : classInfo.schoolSummary
        summary.forEach(oneClass => {
          let obj = {}
          let totalNumber = 0 // 合计
          const secondName = oneClass.schoolName
            ? oneClass.schoolName
            : oneClass.orgName
          oneClass.categorySummary.forEach(item => {
            if (item.children === null || item.children === undefined)
              item.children = []
            colShrink[item.category] = item.children
            if (item.children.length === 0) {
              obj.firstName = firstName
              obj.secondName = secondName
              obj[item.category] = props.isFinance
                ? parseInt(item.finance) / 100
                : parseInt(item.count)
              // totalNumber += props.isFinance ? (parseInt(item.finance) / 100) : parseInt(item.count)
              totalNumber += props.isFinance
                ? parseInt(item.finance)
                : parseInt(item.count)
            } else {
              item.children.forEach(child => {
                obj.firstName = firstName
                obj.secondName = secondName
                obj[child.category] = props.isFinance
                  ? parseInt(child.finance) / 100
                  : parseInt(child.count)
                // totalNumber += props.isFinance ? (parseInt(child.finance) / 100) : parseInt(child.count)
                totalNumber += props.isFinance
                  ? parseInt(child.finance)
                  : parseInt(child.count)
              })
            }
          })
          // obj.total = totalNumber
          obj.total = props.isFinance ? totalNumber / 100 : totalNumber
          tData.push(obj)
        })
        let tempData = {}
        // { row: 0, col: 0, rowspan: 2, colspan: 1 }, // 第0行，第0列的这个单元格，占2行，占1列
        tempData.row = index + rowNumber
        tempData.col = 0
        tempData.rowspan = summary.length
        rowNumber += summary.length - 1
        tempData.colspan = 1
        cell.push(tempData)
        // }
      })
      tableData.value = tData
      colShrinkData.value = colShrink
      mergeCells.value = cell
      spinning.value = false
    }
    const footerRowspanMethod = ({ _rowIndex, _columnIndex }) => {
      if (_rowIndex === 0 && _columnIndex === 0)
        return { rowspan: 1, colspan: 2 }
      if (_rowIndex === 0 && _columnIndex === 1)
        return { rowspan: 1, colspan: 0 }
    }
    const footerHandler = ({ columns, data }) => {
      // 表尾的合计
      let total = {}
      let totalArr = []
      const title = props.isFinance ? '合计（元）' : '合计（人）'
      data.forEach(item => {
        columns.forEach(column => {
          if (column.property) {
            total[column.property] =
              typeof item[column.property] === 'number'
                ? (total[column.property] || 0) + item[column.property]
                : title
          }
        })
      })
      for (let key in total) {
        totalArr.push(total[key])
      }
      return [totalArr]
    }
    const colShrinkHandler = e => {
      // 点击收缩表格
      if (colShrinkFlag) {
        colShrinkFlag = false
        const flag = e.column.parentId === null // 是否为父级
        const field = e.column.field
        if (
          flag &&
          colShrinkData.value[field] !== undefined &&
          colShrinkData.value[field].length >= 2
        ) {
          tableHeader.value.forEach((item, index) => {
            if (item.category === field) {
              if (item.isClose) {
                item.children = tableHeader2.value[index].children
                item.isClose = false
              } else {
                item.children = item.children.slice(0, 2)
                item.isClose = true
              }
            }
          })
        }
        vxeTable.value.loadData(tableData.value)
        colShrinkFlag = true
      }
    }
    const mergeRowMethod = ({ _rowIndex, _columnIndex }) => {
      // 合并单元格
      if (_columnIndex === 0) {
        let data = { rowspan: 0, colspan: 0 }
        for (let i = 0; i < mergeCells.value.length; i++) {
          if (mergeCells.value[i].row === _rowIndex) {
            data = {
              rowspan: mergeCells.value[i].rowspan,
              colspan: mergeCells.value[i].colspan
            }
          }
        }
        return data
      }
    }
    const print = () => {
      // 打印
      const $table = vxeTable.value
      // $table.openPrint()
      $table.print({
        sheetName: `报名统计`,
        style: printStyle,
        isMerge: true,
        beforePrintMethod: ({ content }) => {
          return topHtml + content
        }
      })
    }
    const exportExcel = () => {
      // 导出
      Modal.confirm({
        title: '',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要导出数据吗?',
        okText: '确认',
        okButtonProps: { type: 'default' },
        cancelText: '取消',
        cancelButtonProps: { type: 'primary' },
        onOk: async () => {
          // const response = props.type === 'school' ? await handler.schoolDownloadFile({ termId: term.value }) : await handler.orgDownloadFile({ termId: term.value })
          const response = props.isFinance
            ? props.type === 'school'
              ? await handler.schoolPriceDownloadFile({ termId: term.value })
              : await handler.orgPriceDownloadFile({ termId: term.value })
            : props.type === 'school'
            ? await handler.schoolDownloadFile({ termId: term.value })
            : await handler.orgDownloadFile({ termId: term.value })
          if (!response) {
            message.error('资源为空，不可下载')
            return
          }
          let url = window.URL.createObjectURL(new Blob([response]))
          var downLink = document.createElement('a')
          downLink.download = props.isFinance
            ? props.type === 'school'
              ? '特色课程学校收费统计.xlsx'
              : '特色课程机构收费统计.xlsx'
            : props.type === 'school'
            ? '特色课程学校报名统计.xlsx'
            : '特色课程机构报名统计.xlsx'
          downLink.style.display = 'none'
          downLink.href = url
          downLink.click()
        }
      })
    }
    const termChange = id => {
      // 学期改变
      queryTable(id)
    }
    const getCursor = data => {
      // 表头是否显示小手
      for (let i = 0; i < tableHeader2.value.length; i++) {
        if (tableHeader2.value[i].category === data.category) {
          if (tableHeader2.value[i].children.length > 2) {
            return 'cursor-pointer myFlex'
          }
        }
      }
      return 'myFlex'
    }
    const showIcon = data => {
      // 是否显示展开图标
      for (let i = 0; i < tableHeader2.value.length; i++) {
        if (tableHeader2.value[i].category === data.category) {
          return tableHeader2.value[i].children.length > 2
        }
      }
    }
    const getIcon = data => {
      // 展开图标
      for (let i = 0; i < tableHeader2.value.length; i++) {
        if (
          tableHeader2.value[i].children.length &&
          tableHeader2.value[i].category === data.category
        ) {
          return tableHeader2.value[i].children.length === data.children.length
        }
      }
      return true
    }
    const topHtml = `
            <h1 class="title">特色课程${
              props.type === 'school' ? '学校' : '机构'
            }报名统计</h1>
            `
    const printStyle = `
            .title {
              text-align: center;
            }
            `

    return {
      spinning,
      queryTable,
      termOpt,
      term,
      tableHeader,
      tableData,
      mergeCells,
      vxeTable,
      print,
      exportExcel,
      footerHandler,
      termChange,
      footerRowspanMethod,
      colShrinkHandler,
      mergeRowMethod,
      getCursor,
      showIcon,
      getIcon
    }
  }
}
</script>
<style scoped>
@media print {
  :deep(.d-curd-header) {
    display: none;
  }
}

:deep(.ant-table-footer) {
  padding: 0 !important;
}

:deep(.vxe-table) {
  /* width: 91vw !important; */
  overflow-y: hidden;
  /* margin-top: 3rem; */
}

.myFlex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.noScroll::-webkit-scrollbar {
  width: 0;
}

/* :deep(.vxe-header--row>th) {
  cursor: pointer
} */
</style>
