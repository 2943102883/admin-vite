import { row } from "mathjs"
const sharedOnCell = (record, rowIndex) => {
  // console.log('record', record, rowIndex);
  if (rowIndex === 0) {
    return {
      colSpan: 3,
    }
  }
  if (rowIndex === 2) {
    return {
      colSpan: 3,
    }
  }
}
export const schoolColumns = [
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    align: 'center',
    width: 100,
    // customCell: (record, rowIndex) => {
    //   if (rowIndex === 1) {
    //     return { rowSpan: 2 }
    //   }
    // },
    customCell: sharedOnCell,
    customRender: ({ text }) => {
      return <span style='text-align: right;display: block;'>{text}</span>
    }
  },
  {
    title: '机构名称',
    dataIndex: 'orgName',
    align: 'center',
    width: 260,
    customCell: sharedOnCell,
    customRender: ({ text }) => {
      return (
        <span style='text-align: left;display: block;margin-left:2em;'>
          {text}
        </span>
      )
    }
  },
  {
    title: '合计（元）',
    dataIndex: 'totalMoney',
    align: 'center',
    width: 100,
    customCell: sharedOnCell,
    customRender: ({ text }) => {
      return <span style='text-align: right;display: block;'>{text}</span>
    }
  }
]
// 字段列的定义
export const orgColumns = [
  {
    title: '机构名称',
    dataIndex: 'orgName',
    align: 'center',
    width: 260,
    customRender: ({ text }) => {
      return (
        <span style='text-align: left;display: block;margin-left:2em;'>
          {text}
        </span>
      )
    }
  },
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    align: 'center',
    width: 100,
    customRender: ({ text }) => {
      return <span style='text-align: right;display: block;'>{text}</span>
    }
  },
  {
    title: '合计（元）',
    dataIndex: 'totalMoney',
    align: 'center',
    width: 100,
    customRender: ({ text }) => {
      return <span style='text-align: right;display: block;'>{text}</span>
    }
  }
]
