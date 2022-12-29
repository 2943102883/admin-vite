# AjaxSelect 远程加载选项的下拉框

下拉选项从远程RESTful接口获取，可以定义远程接口的模块名称和方法名称。远程数据请求使用atom标准的查询接口，GET方式查询结果集。可以附带查询参数。

``` html

    <d-ajax-select
      :labelInValue="true"
      labelField="name"
      valueField="id"
      module="Role"
      action="query"
      :valueMap="{value:'id',label:'name'}"
      v-model:value="value.somerole"
      @change="change"
    ></d-ajax-select>


<script>

export default {
  setup(props, context) {
    const change = v => {
      console.log(v)
    }
    return {
      change,
    }
  },

}
</script>

```