<template>
    <div class="container">
        <h1 class="title">Quinielas disponibles</h1>
        <div class="row">
            <div class="col-3" v-for="(event, index) in events" :key="index">
                <EventCard :data="event" />
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue'
import { ajax } from '../../utils/AjaxRequest'
import EventCard from './EventCard.vue'

export default defineComponent({
    components: {
        EventCard
    },
    setup() {

        const events = ref()

        onMounted(() => {
            //activeEvents()
        })

        const activeEvents = () => {

            let ajaxData = {
                method: "get",
                url: "/activeEvents"
            }

            ajax(ajaxData)
            .then(function (response) {
                console.log(response.data)
                events.value = response.data
            })
            .catch(error => {

                console.log("=======")
                console.log(error)

            })

        }

        return {
            events
        }

    }
})

</script>

<style lang="less" scoped src="../../assets/less/events/Index.less"></style>
