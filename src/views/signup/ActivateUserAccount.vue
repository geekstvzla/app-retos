<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-4">
                <h3 class="title">{{ t('title') }}<span v-if="name !== null" class="name">, {{ name }}</span></h3>
                <Alert :options="alertProps" />
                <p v-if="name !== null">{{ t('legend') }}</p>
                <p v-if="name !== null" class="wrapper-signin">👉 <router-link :to="{ name: 'sign-in' }" class="btn btn-filled btn-sign-in">{{ t('signIn') }}</router-link> 👈</p>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/ActivateUserAccountEng';
import es from './langs/ActivateUserAccountEsp';
import Alert from '../../components/Alert.vue';
import { useRoute } from 'vue-router'
import { ajax } from '../../utils/AjaxRequest'

export default defineComponent({
    components: {
        Alert
    },
    setup() {

        onMounted(() => {
            
            if(route.query.userId && route.query.langId) {
                activateAccount();
            }

        });

        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const name = ref(null);
        const route = useRoute();

        const activateAccount = () => {

            alertProps.show = false;
            
            let ajaxData = {
                method: "post",
                params: {
                    langId: route.query.langId,
                    userId: route.query.userId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/activate-user-account"
            }

            ajax(ajaxData)
            .then(function (response) {

                if(response.status === 200 && response.data) {
                   
                    name.value = (response.data.hasOwnProperty('name')) ? response.data.name : null

                    if(response.data.statusCode === 1) {

                        var message = t('alert.success')
                        var typeMessage = "success"

                    } else if(response.data.statusCode === 2) {

                        var message = t('alert.accountActivated')
                        var typeMessage = "warning"

                    } else if(response.data.statusCode === 0) {

                        var message = t('alert.accountNoExist')
                         var typeMessage = "error"

                    } else {

                        var message = t('alert.error')
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
                        message: t('alert.error'),
                        type: "warning"
                    }

                } else {

                    throw {
                        close: true,
                        message: t('alert.error'),
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
            t
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signUp/ActivateUserAccount.less" scoped></style>