<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <h3 class="title">{{ t('title') }}</h3>
                <div id="login-carousel" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <EmailForm @response="emailFormResponse" 
                                       :is-visible="forms.email.visible"/>
                        </div>
                        <div class="carousel-item">
                            <AccessCodeForm @goBack="goToEmailFrom" 
                                            @response="accessCodeFormResponse"
                                            :email="forms.accessCode.email" 
                                            :is-visible="forms.accessCode.visible" />
                        </div>
                        <div class="carousel-item">
                            <NewAccountForm @goBack="goToEmailFrom" 
                                            @response="newAccountFormResponse"
                                            :email="forms.newAccount.email" 
                                            :is-visible="forms.newAccount.visible" />
                        </div>
                    </div>
                </div>
                <div class="d-grid">
                    <Alert :options="alertProps" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng';
import es from './langs/IndexEsp';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import Alert from '../../components/Alert.vue';
import { useUserAccountStore } from '../../stores/UserAccount.js';
import * as bootstrap from 'bootstrap';
import AccessCodeForm from './AccessCodeForm.vue';
import EmailForm from './EmailForm.vue';
import NewAccountForm from '../signup/Index.vue';

export default defineComponent({
    components: {
        AccessCodeForm,
        Alert,
        EmailForm,
        NewAccountForm
    },
    setup() {

        onMounted(() => {
            
            carousel.value = new bootstrap.Carousel('#login-carousel');

            if(route.query.message) {

                let alertData = {
                    message: route.query.message,
                    show: true,
                    type: route.query.type_response
                };
                Object.assign(alertProps, alertData);

            };

        });
        
        const carousel = ref(null);
        const forms = reactive({
            accessCode: {
                email: "",
                visible: false
            },
            email: {
                visible: false
            },
            newAccount: {
                email: "",
                visible: false
            }
        });
        const userAccountStore = useUserAccountStore();
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
        const route = useRoute();
        const router = useRouter();
        
        onBeforeRouteLeave((to, from, next) => {

            alertProps.show = false;
            next();

        });

        const emailFormResponse = (data) => {

            if(data.statusCode === 0) {

                goToNewAccountForm(data);

            } else if(data.statusCode === 1) {

                generatedAccessCode(data);

            }

            Object.assign(alertProps, data.alertData);

        }

        const generatedAccessCode = (data) => {
            
            if(data.alertData.type === "success") {

                forms.accessCode.email = data.email;
                forms.accessCode.visible = true;
                forms.email.visible = false;
                carousel.value.to(1);

            }

        };

        const goToEmailFrom = () => {
           
            forms.email.visible = true;
            carousel.value.to(0);
            alertProps.show = false;

        };

        const goToNewAccountForm = (data) => {
       
            forms.newAccount.email = data.email;
            forms.newAccount.visible = true;
            carousel.value.to(2);

        };

        const accessCodeFormResponse = (data) => {

            if(data.statusCode === 1) {

                 setTimeout(() => {
                                
                    sessionData(data.userData)
                    router.push({ name: "home" })

                }, 3000)

            };

            Object.assign(alertProps, data.alertData);

        };
    
        const sessionData = (data) => {

            localStorage.setItem("userAvatar", data.avatar);
            localStorage.setItem("userEmail", forms.accessCode.email)
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", data.username);

            userAccountStore.$patch((store) => {
                store.state.avatar = data.avatar
                store.state.email = forms.accessCode.email
                store.state.id = data.userId
                store.state.username = data.username
            })

        };

        const newAccountFormResponse = (data) => {

            if(data.statusCode === 1) {

                 setTimeout(() => {
                                
                    goToEmailFrom();

                }, 3000)

            };

            Object.assign(alertProps, data.alertData);

        };

        return {
            accessCodeFormResponse,
            alertProps,
            emailFormResponse,
            generatedAccessCode,
            goToEmailFrom,
            forms,
            newAccountFormResponse,
            route,
            t
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signIn/Index.less" scoped></style>