<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-4">
                <h3 class="title">{{ translation.activateUserAccount.title }}<span v-if="name !== null" class="name">, {{ name }}</span></h3>
                <Alert :options="alertProps" />
                <p v-if="name !== null">{{ translation.activateUserAccount.legend }}</p>
                <p v-if="name !== null" class="wrapper-signin">👉 <router-link :to="{ name: 'sign-in' }" class="btn btn-sign-in">{{ translation.activateUserAccount.signIn }}</router-link> 👈</p>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import Alert from '../../components/Alert.vue'
import { useTranslatorStore } from '../../stores/Translator.js'
import { useEncryptionStore } from '../../stores/encryption.js'
import { useRoute } from 'vue-router'
import { ajax } from '../../utils/AjaxRequest'

export default defineComponent({
    components: {
        Alert
    },
    setup() {

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        })
        const encryptionStore = useEncryptionStore()
        const name = ref(null)
        const route = useRoute()
        const translation = useTranslatorStore().translation(parseInt(route.query.langId))

        onMounted(() => {
            
            if(route.query.userId && route.query.langId) {
                const translation = useTranslatorStore().translation(route.query.langId)
                activateAccount()
            }

        })

        const activateAccount = () => {

            alertProps.show = false
            
            let ajaxData = {
                method: "post",
                params: {
                    langId: route.query.langId,
                    userId: encryptionStore.encrypt(route.query.userId)
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/activate-user-account"
            }

            ajax(ajaxData)
            .then(function (response) {

                if(response.status === 200 && response.data.response) {

                    name.value = (response.data.response.hasOwnProperty('name')) ? response.data.response.name : null

                    if(response.data.response.statusCode === 1) {

                        var message = translation.activateUserAccount.alert.success
                        var typeMessage = "success"

                    } else if(response.data.response.statusCode === 2) {

                        var message = translation.activateUserAccount.alert.accountActivated
                        var typeMessage = "warning"

                    } else if(response.data.response.statusCode === 0) {

                        var message = translation.activateUserAccount.alert.accountNoExist
                         var typeMessage = "error"

                    } else {

                        var message = translation.activateUserAccount.alert.error
                        var typeMessage = "warning"

                    }

                    let alertData = {
                        message: message,
                        show: true,
                        type: typeMessage
                    }
                    Object.assign(alertProps, alertData)

                } else if(response.status === 200 && !response.data.response) {

                    throw {
                        message: translation.activateUserAccount.alert.error,
                        type: "warning"
                    }

                } else {

                    throw {
                        close: true,
                        message: translation.activateUserAccount.alert.error,
                        timer: true,
                        timerSeconds: 3,
                        type: "error"
                    }

                }

            })
            .catch(error => {

                if(error.message){
                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }
                    Object.assign(alertProps, alertData)
                }

            })

        }

        return {
            alertProps,
            name,
            translation
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signup/ActivateUserAccount.less" scoped></style>