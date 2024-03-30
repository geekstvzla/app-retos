<template>
    <div class="container-lg">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10">
                <h2 class="title">{{ route.params.description }}</h2>
                <Menu />
                <!-- <Alert :closeButton="alertStore.state.close"
                       :message="alertStore.state.message"
                       :show="alertStore.state.show"
                       :timer="alertStore.state.timer"
                       :timerSeconds="alertStore.state.timerSeconds"
                       :type="alertStore.state.type"
                       @alertClosed="alertStore.close()" /> -->
                <router-view :key="route.fullPath" />
            </div>
        </div>
    </div>
    <Sidebar :pools="pools" />
</template>

<script>

import { onBeforeMount, computed, defineComponent, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useUserAccountStore } from '../../js/stores/userAccount.js'
import { useUtils } from '../../js/components/Utils.js'
import Alert from '../../js/components/Alert.vue'
import { useAlertStore } from '../../js/components/stores/alert.js'
import Menu from './Menu.vue'
import Sidebar from './Sidebar.vue'

export default defineComponent({
    components: {
        Alert,
        Menu,
        Sidebar
    },
    setup() {

        onMounted(() => {

            if(userAccount.state.id) {
                userPools()
            } else {
                router.push({ name: "pool" })
            }

        })

        onBeforeRouteLeave((to, from, next) => {
            alertStore.close()
            next();
        })

        const alertStore = useAlertStore()
        const pools = ref([])
        const route = useRoute()
        const router = useRouter()
        const userAccount = useUserAccountStore()
        const utils = useUtils()

        const userPools = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventId: route.params.id
                },
                url: "/userPools"
            }

            utils.ajaxRequest(ajaxData)
            .then(function (response) {

                if(response.status === 200) {

                    if(response.data.length > 1) {
                        pools.value = response.data
                    }else if(response.data.length === 1) {
                        pools.value = response.data
                        router.push({ name: "pool", params: { pool_id: response.data[0].id } })
                    } else {
                        router.push({ name: "pool" })
                        /*let alertData = {
                            message: 'No tienes ninguna <b>Quiniela</b> asociada para este evento!. Debes darle al botón <b>"Crear nueva quiniela"</b> para empezar a jugar.',
                            show: true,
                            type: "warning"
                        }
                        alertStore.showMessage(alertData)*/
                    }

                } else {
                    throw {
                        message: "Ocurrió un error!",
                        type: "error"
                    }
                }

            })
            .catch(error => {
                console.log(error)
            })

        }

        return {
            alertStore,
            pools,
            route,
            userAccount
        }

    }
})

</script>

<style lang="less" scoped src="../../less/events/event.less"></style>
