# 使用curd-data-table

## 全局使用curd-data-table

如果想要在全局使用curd-data-table，需要在app的启动程序(例如main.js)中加入以下代码:

``` javascript
import atomleaf from '/components'

app.use(atomleaf)

```

## 主要功能

curd-table实现表格数据的展示以及增删改查的功能。目的是通过简单的装配，就可以实现完整的增删改查功能。包括以下功能:

- 数据的展示：可以通过模板插槽定义每一列的数据展示。
- 弹出新建表单对话框进行新增，弹出编辑对话框进行编辑；只需要布局好表单的控件，不需要书写复杂的逻辑。
- 可配置工具栏功能。
- 可配置行编辑功能。
- 可在工具栏上配置扩展的查询过滤控件。同样也只需要做控件的布局即可，不需要书写复杂的逻辑。
- 可配置在查询条件面板上实现更复杂的查询功能。
- 可配置多种数据详细展示的方式。包括抽屉式，或者弹出对话框、页面。

## 基本表格界面的布局

- 表格标题栏：如果设置了title属性，则显示表格标题。如果没有配置title属性，不显示表格标题栏。表格标题栏的最右侧有extra插槽，可以扩展更多的操作控件。

- 表格工具栏：包括左右两部分。
  左对齐的是数据过滤控件，右对齐的是表格操作控件。数据过滤控件默认有关键词查询和相关的搜索和重置按钮；表格操作控件默认只有一个“新建”按钮。两部分都可以通过插槽扩展，分别是filter插槽和controlex插槽。

- 扩展搜索: 这部分一般是隐藏的，因为多数功能的查询过滤参数不多，在工具栏上配置好查询参数即可满足要求。但是工具栏上位置有限，对于更多复杂的查询要求就不能满足了。可以把查询参数布局到扩展搜索栏中。默认只要扩展搜索栏安装了插槽即可自动显示。

- 表格：展示数据的表格。
  可以通过columns属性配置列的显示，包括名称、宽度、排序等等(具体可参考Ant Design的文档)。
  可以通过动态插槽名称 col.列名 来定义具体列的内容布局。
  可以通过action插槽配置行操作的扩展功能。

- 分页栏: 自动实现数据的分页。

## 基本装配过程

1. 用模板生成基本组件

通常一个数据的增删改查功能包括几部分组件:

- table.vue :主界面
- form.vue :表单界面，如果新增表单和编辑表单不相同，可以创建两个表单界面。newform.vue和editform.vue
- detail.vue : 如果需要显示单个数据的详细内容，可以另外增加一个detail.vue。放入detail插槽中。
- def.js: 可以把列的配置，校验规则的配置另外写入一个def.js中。在list.vue或tform.vue,detail.vue中分别导入需要的配置。

> 自动工具可以根据模板自动生成以上文件组件

2. 配置字段

修改def.js里面的columns，添加需要显示的列。

``` javascript

export const columns = [{
    title: '角色名称',
    align: 'start',
    sorter: true,
    dataIndex: 'name',
  },
  {
    title: '角色账号',
    dataIndex: 'id',
    sorter: true
  },
]

```

3. 如果需要，在list.vue中，通过列的动态插槽模板，对特殊的列进行界面布局。

``` html
      <!-- 通过插槽配置特殊列的展示模板 -->
      <template #col.name="{ record }">
        <a
          href="#"
          style="font-weight: bold"
          @click="table.openDetail(record)"
          >{{ record.name }}</a
        >
      </template>
```

4. 修改form.vue，布局新增和编辑表单的控件。大多数功能新增和编辑的表单是一样的。

``` html
  <a-form
    ref="model"
    :rules="rules"
    :model="value"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
  >
    <a-form-item label="角色名称" name="name">
      <a-input v-model:value="value.name" placeholder="角色名称"></a-input>
    </a-form-item>
    <a-form-item label="角色账号" name="id">
      <a-input v-model:value="value.id" placeholder="角色账号"></a-input>
    </a-form-item>
  </a-form>
```

5. 修改def.js里面的rules，增加表单的数据校验规则。

``` javascript
export const rules = {
  name: [{
      required: true,
      message: '请输入角色的名称',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 128,
      message: '至少2个字符，最长128个字符',
      trigger: 'blur',
    },
  ],
  id: [{
      required: true,
      message: '请输入角色的账号',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 64,
      message: '最短3个字符，最长64个字符',
      trigger: 'blur',
    },
  ]

}

```

6. 修改detail.vue，布局数据的详细界面。如果详细界面比较简单，可以直接在list中布局。

``` html
<a-descriptions title="角色详细" :column="1">
  <a-descriptions-item label="名称">{{ value.name }}</a-descriptions-item>
  <a-descriptions-item label="账号">{{ value.id }}</a-descriptions-item>
</a-descriptions>
```

7. 在list.vue中，根据需要添加查询的条件控件。

``` html
<!-- 添加查询条件组件 -->
<template #filters="{ param }">
  <a-space name="name">
    <a-input v-model:value="param.name" placeholder="名称"></a-input
    ><a-input v-model:value="param.id" placeholder="账号"></a-input>
  </a-space>
</template>
```
