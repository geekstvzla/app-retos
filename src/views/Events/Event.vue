<template>
    <div class="container-lg">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10">
                <h2 class="title">{{ route.params.event_title }}</h2>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-12 col-md-4">
                <img
                    :alt="route.params.event_title"
                    :src="event.event_cover_image"
                    class="card-img-top"
                />
            </div>
            <div class="col-12 col-md-6">
                <h2 class="title">{{ route.params.event_title }}</h2>
                <!-- <Alert :closeButton="alertStore.state.close"
                       :message="alertStore.state.message"
                       :show="alertStore.state.show"
                       :timer="alertStore.state.timer"
                       :timerSeconds="alertStore.state.timerSeconds"
                       :type="alertStore.state.type"
                       @alertClosed="alertStore.close()" /> -->
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { useUserAccountStore } from '../../stores/UserAccount.js'
import { ajax } from '../../utils/AjaxRequest'
import Alert from '../../components/Alert.vue'

export default defineComponent({
    components: {
        Alert
    },
    setup() {
        onBeforeMount(() => {
            getEventData()
        })

        onBeforeRouteLeave((to, from, next) => {
            //alertStore.close()
            next()
        })

        const event = ref()
        const route = useRoute()
        const userAccount = useUserAccountStore()

        const getEventData = () => {
            let ajaxData = {
                method: 'get',
                params: {
                    eventId: route.params.event_id
                },
                url: import.meta.env.VITE_API_BASE_URL + '/events/event-data'
            }

            ajax(ajaxData)
                .then(function (response) {
                    if (response.status === 200) {
                        event.value = response.data.response.data
                        event.value.event_cover_image =
                            import.meta.env.VITE_API_BASE_URL +
                            '/images/events/' +
                            route.params.event_id +
                            '/' +
                            event.value.event_cover_image
                        console.log(event.value.event_cover_image)
                    } else {
                        console.log('error')
                        throw {
                            message: 'Ocurrió un error!',
                            type: 'error'
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        return {
            //alertStore,
            event,
            route,
            userAccount
        }
    }
})
</script>

<style lang="less" scoped src="../../assets/less/events/Event.less"></style>
