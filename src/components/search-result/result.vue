<template>
  <div>
    <a-list item-layout="vertical" size="large" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item key="item.title">
          <!-- <template #actions>
          <span v-for="{ type, text } in actions" :key="type">
            <component v-bind:is="type" style="margin-right: 8px" />
            {{ text }}
          </span>
        </template>
          -->
          <template #extra></template>
          <a-list-item-meta>
            <template #title>
              <a href="javascript:;" @click="handleClick(item)" :class="[item.index==='atom-es:freedoc' ? 'active':'', item.index==='base-es:guidelines'||item.index==='base-es:situation' ||item.index==='base-es:regulations'||item.index==='base-es:bdata'?item.source.data.contentType!='html'&&item.source.data.contentType!='htm'?'active-file':'':'']">{{ item.title }}</a>
            </template>
            <template #description></template>
          </a-list-item-meta>
          <p
            class="search-result"
            v-for="(text,index) in item.highlight"
            :key="index"
            v-html="replaceStr(text)"
          ></p>
        </a-list-item>
      </template>
    </a-list>
    <div class :style="{ width: '100%', padding: '8px',textAlign:'right' }">
      <a-pagination
        :size="10"
        :total="total"
        :page-size="10"
        :current="current"
        @change="changePage"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent,ref } from 'vue'

export default defineComponent({
  setup(props, context) {
    const handleClick = (item) => {
      // if(item.==="atom-es:freedoc"){
        context.emit("item", item)
      // }
      console.log("handleClick",item);
    }
    const changePage = (param) => {
      context.emit("page", param)
      // console.log("param",param);
    }
    // 处理字符串
    const replaceStr=(str)=>{
       const newStr=str.replace(/[\\n\……\\t]+/gm,"")
       return newStr 
    }
    return {
      handleClick,
      changePage,
      replaceStr
    }

  },
  props: {
    data: {
      type: Array,
      required: true
    },
    param: {
      type: Object,
      required: true
    },
    service: {
      type: Object,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  }
})
</script>
<style lang="less" scoped>
em {
  color: #f73131 !important;
}
.active{
  color: rgb(6, 206, 206);
}
.active-file{
  color: rgb(79, 206, 6);
}
</style>