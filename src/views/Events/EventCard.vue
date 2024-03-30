<template>
    <div class="card" style="width: 18rem;">
        <img :alt="props.data.event_name" :src="'/images/event/'+props.data.event_cover_image" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">{{ props.data.event_name }}</h5>
            <router-link :to="{ name: 'event', params: linkParams }" class="btn btn-primary d-block">Jugar</router-link>
        </div>
    </div>
</template>

<script>

import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    props: {
        data: Object
    },
    setup(props) {

        const linkParams = {
            description: props.data.event_name,
            id: props.data.event_id
        }

        return {
            linkParams,
            props
        }

    }
})

</script>

<style lang="less" scoped src="../../assets/less/events/EventCard.less"></style>
