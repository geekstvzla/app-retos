<template>
    <div id="menu" class="col-12">
        <button @click="showSidebar"
                aria-controls="sidebarPoolMenu"
                class="btn btn-primary"
                type="button">
            Tus quinielas
        </button>
        <button @click="showComingSoon" class="btn btn-primary">Tabla de líderes</button>
    </div>

    <Toast :closeButton="dataToast.closeButton"
           :ids="['comingSoon']"
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
    setup() {

        const dataToast = reactive({})
        const sidebar = ref(null)
        const userAccount = useUserAccountStore()

        onMounted(() => {

            let sidebarEle = document.getElementById('sidebarPoolMenu')
            sidebar.value = bootstrap.Offcanvas.getOrCreateInstance(sidebarEle)
            
        })

        const showComingSoon = () => {

            showToast("Pronto!")

        }

        const showSidebar = () => {

            if(userAccount.state.id === null) {
                showToast("Debes iniciar sesión!")
            } else {
                sidebar.value.show()
            }

        }

        const showToast = (message) => {

            dataToast.closeButton = {show: true, text: "Ok"}
            dataToast.message = message
            dataToast.placement = "middle-center"
            dataToast.type = "warning"

            let toastEle = document.getElementById('comingSoon')
            let toastInstance = bootstrap.Toast.getOrCreateInstance(toastEle)
            toastInstance.show()

        }

        const toastClosed = () => {

            dataToast.message = null
            dataToast.placement = null
            dataToast.type = null

        }

        return {
            dataToast,
            showComingSoon,
            showSidebar,
            toastClosed
        }

    }
})

</script>

<style lang="less" scoped src="../../less/events/menu.less"></style>
