<template>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarPoolMenu" aria-labelledby="sidebarPoolMenuLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="sidebarPoolMenuLabel">Tus quinielas</h5>
            <button aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas" type="button"></button>
        </div>
        <div class="offcanvas-body">
            <div class="alert alert-warning text-center" role="alert" v-if="props.pools.length === 0">
                No tienes ninguna quiniela creada!
            </div>
            <router-link @click="checkPools"
                         class="btn btn-secondary"
                         :to="{ name: 'pool' }">Crear nueva quiniela</router-link>
            <router-link @click="checkPools"
                         class="btn btn-primary"
                         :to="{ name: 'pool', params: { pool_id: pool.id } }"
                         v-for="(pool, index) in pools">Quiniela #{{ (index + 1) }}</router-link>
        </div>
    </div>

    <Toast :closeButton="dataToast.closeButton"
           :ids="['noMoreFreePool']"
           :loading="false"
           :message="dataToast.message"
           :placement="dataToast.placement"
           :type="dataToast.type"
           @toastClosed="toastClosed()" />

</template>

<script>

import { defineComponent, onMounted, reactive, ref } from 'vue'
import Toast from '../../js/components/Toast.vue'
import * as bootstrap from 'bootstrap'
import { useUserAccountStore } from '../../js/stores/userAccount.js'

export default defineComponent({
    components: {
        Toast
    },
    props: {
        pools: Array
    },
    setup(props) {

        const dataToast = reactive({})
        const sidebar = ref(null)
        const userAccount = useUserAccountStore()

        onMounted(() => {

            let sidebarEle = document.getElementById('sidebarPoolMenu')
            sidebar.value = bootstrap.Offcanvas.getOrCreateInstance(sidebarEle)

        })

        const showToast = (message) => {

            dataToast.closeButton = {show: true, text: "Ok"}
            dataToast.message = message
            dataToast.placement = "middle-center"
            dataToast.type = "warning"

            let toastEle = document.getElementById('noMoreFreePool')
            let toastInstance = bootstrap.Toast.getOrCreateInstance(toastEle)
            toastInstance.show()

        }

        const toastClosed = () => {

            dataToast.message = null
            dataToast.placement = null
            dataToast.type = null

        }

        const checkPools = () => {

            if(userAccount.state.id === null) {

                sidebar.value.hide()
                showToast("Debes iniciar sesión!")

            } else {

                sidebar.value.hide()

            }


        }

        return {
            checkPools,
            dataToast,
            props,
            showToast,
            toastClosed
        }

    }
})

</script>

<style lang="less" scoped src="../../less/events/sidebar.less"></style>
