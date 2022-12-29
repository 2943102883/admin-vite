<template>
  <v-list>
    <template>
      <v-list-item
        v-for="item in value"
        :key="item.text"
        :link="item.text !== '-' ? true : undefined"
        :to="item.to"
      >
        <v-list-item-action v-if="!item.split">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content v-if="!item.split">
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
        <v-divider v-if="item.split" />
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, Object],
    },
  },
}
</script>

<style scoped></style>
