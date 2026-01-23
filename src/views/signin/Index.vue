<template>
    <div :class="inModal()">
        <div class="row g-0 justify-content-center">
            <div :class="contentWidth()">
                <h3 class="title">{{ t('title') }}</h3>
                <div class="alert alert-warning leyend" role="alert" v-if="forms.email.visible">
                    {{ t('paragraph') }}
                </div>
                <div id="login-carousel" class="carousel slide" data-bs-touch="false">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <EmailForm @response="emailFormResponse" 
                                       :is-visible="forms.email.visible"/>
                        </div>
                        <div class="carousel-item">
                            <AccessCodeForm @goBack="goToEmailForm" 
                                            @response="accessCodeFormResponse"
                                            :email="forms.accessCode.email" 
                                            :is-visible="forms.accessCode.visible" />
                        </div>
                        <div class="carousel-item">
                            <NewAccountForm @goBack="goToEmailForm" 
                                            @response="newAccountFormResponse"
                                            :email="forms.newAccount.email" 
                                            :is-visible="forms.newAccount.visible" />
                        </div>
                        <div class="carousel-item">
                            <ActivationCode @goBack="goToEmailForm"
                                            @goForward="goToEmailForm"
                                            :is-visible="forms.activationCode.visible"
                                            @response="ActivationCodeResponse" />
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
import ActivationCode from '../signup/ActivationCode.vue';
import EmailForm from './EmailForm.vue';
import NewAccountForm from '../signup/Index.vue';

export default defineComponent({
    emits: ["closeModal"],
    components: {
        AccessCodeForm,
        ActivationCode,
        Alert,
        EmailForm,
        NewAccountForm
    },
    props: {
        openFrom: {
            String,
            default: "default"
        }
    },
    setup(props, { emit }) {

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
            activationCode: {
                visible: false
            },
            email: {
                visible: true
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

        const accessCodeFormResponse = (data) => {

            if(data.statusCode === 1) {

                sessionData(data.userData);
                
                if(props.openFrom === "modal") {
                    
                    setTimeout(() => {

                        emit("closeModal");

                    }, 3000);

                } else {

                     setTimeout(() => {

                        router.push({ name: "home" });

                    }, 3000);

                }

            };

            Object.assign(alertProps, data.alertData);

        };

        const ActivationCodeResponse = (data) => {

            if(data.statusCode === 1) {

                sessionData(data.userData);
                
                if(props.openFrom === "modal") {

                    setTimeout(() => {

                        emit("closeModal");
                        
                    }, 3000);

                } else {

                     setTimeout(() => {

                        router.push({ name: "home" });

                    }, 3000)

                }

            };

            Object.assign(alertProps, data.alertData);

        }

        const contentWidth = () => {

            let classString = {
                modal: "col-12",
                default: "col-12 col-md-8 col-lg-6 col-xl-5"
            };

            return classString[props.openFrom];

        };

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

        const goToEmailForm = () => {
           
            forms.email.visible = true;
            carousel.value.to(0);
            alertProps.show = false;

        };

        const goToNewAccountForm = (data) => {
            
            forms.email.visible = false;
            forms.newAccount.email = data.email;
            forms.newAccount.visible = true;
            carousel.value.to(2);

        };

        const inModal = () => {

            let classString = {
                modal: "container g-0 inModal",
                default: "container g-0"
            };

            return classString[props.openFrom];

        };

        const newAccountFormResponse = (data) => {
            
            if(data.statusCode === 1) {

                forms.activationCode.visible = true;
                forms.email.visible = false;
                forms.newAccount.visible = false;
                carousel.value.to(3);

            }
            
            Object.assign(alertProps, data.alertData);

        };

        const sessionData = (data) => {

            localStorage.setItem("userAvatar", data.avatar);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userFirstName", data.name);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);

            userAccountStore.$patch((store) => {
                store.state.avatar = data.avatar
                store.state.email = data.email
                store.state.id = data.id
                store.state.name = data.name
                store.state.username = data.username
            });

        };

        return {
            accessCodeFormResponse,
            ActivationCodeResponse,
            alertProps,
            contentWidth,
            emailFormResponse,
            generatedAccessCode,
            goToEmailForm,
            forms,
            inModal,
            newAccountFormResponse,
            props,
            route,
            t
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signIn/Index.less" scoped></style>