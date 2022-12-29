<template>
  <span class="body-2">
    <v-icon color="primary" small class="mr-2" @click="curd.openNew(item)">
      mdi-plus-circle-outline
    </v-icon>
    <v-icon color="primary" small class="mr-2" @click="curd.openEdit(item)">
     <a-icon type="edit" />
    </v-icon>
    <v-icon color="grey" small @click="deleteItem(item)">
      mdi-delete-outline
    </v-icon>
  </span>
</template>

<script>
export default {
  name: "rowAction",
  props: {
    curd: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    detail: {
      type: [String, Boolean],
    },
  },
  methods: {
    deleteItem(item) {
      this.$confirm("确定要删除数据?", {
        title: "删除确认",
        buttonTrueText: "确认",
        buttonTrueColor: "grey",
        buttonFalseText: "取消",
        buttonFalseColor: "primary",
        persistent: false,
      }).then((res) => {
        if (res) {
          // 确定
          this.curd.deleteOne(item);
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
