<template>
    <v-container>
        <v-row align="center" justify="center" class="ma-5">
            <v-img :src="nodata" :max-width="128" :max-height="128">
            </v-img>
        </v-row>
        <v-row align="center" justify="center" class="ma-5">
            {{text}}
        </v-row>
        <v-row align="center" justify="center" class="ma-5">
            <v-btn color="secondary" outlined @click="$emit('refresh')">刷新</v-btn>
        </v-row>
    </v-container>
</template>

<script>
    import defaultImage from './nodata.svg'

    export default {
        props: {
            text: {
                type: String,
                default: "暂无数据..."
            }
        },
        data() {
            return {
                nodata: defaultImage
            }
        },

    }
</script>

<style scoped>

</style>
