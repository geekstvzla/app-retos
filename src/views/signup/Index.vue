<template>
    <form>
        <div class="d-grid leyend">
            {{ t('help') }}
        </div>
        <div :class=" (v$.email.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
            <label class="form-label">{{ t('inputs.email.label') }}</label>
            <span class="input-group-text">
                <i class="bi bi-envelope-at"></i>
            </span>
            <input class="form-control"
                    :disabled="attrs.email.disabled"
                    id="email"
                    type="text"
                    v-model.trim="v$.email.$model">
            <div class="wrapper-email-text">
                <div class="form-text">
                {{ t('inputs.email.help') }}
                </div>
                <div class="error-msg" v-for="error of v$.email.$errors" :key="error.$uid">
                    <p>{{ error.$message }}</p>
                </div>
            </div>
        </div>
        <div :class=" (v$.username.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
            <label class="form-label">{{ t('inputs.username.label') }}</label>
            <span class="input-group-text">
                <i class="bi bi-person"></i>
            </span>
            <input class="form-control"
                   :disabled="attrs.username.disabled"
                   id="username"
                   @keyup="checkUserExist"
                   type="text"
                   v-model="v$.username.$model">
            <span class="input-group-text">
                <div class="spinner-border spinner-border-sm" role="status" v-if="attrs.username.searching">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <i :class="'bi '+attrs.username.iconClass" v-else></i>
            </span>
            <div class="form-text">
                {{ t('inputs.username.help') }}
            </div>
            <div class="error-msg" v-for="error of v$.username.$errors" :key="error.$uid">
                <p>{{ error.$message }}</p>
            </div>
        </div>
        <div class="d-grid">
            <div class="btn-group" role="group">
                <button :disabled="attrs.goBackBtn.disabled"
                        @click="goBack"
                        class="btn"
                        id="btn-sign-in"
                        type="button">{{ t('backBtn') }}</button>
                <button :disabled="attrs.signUpBtn.disabled"
                        @click="signup"
                        class="btn"
                        id="btn-sign-in"
                        type="button"
                        v-html="attrs.signUpBtn.html"></button>
            </div>
        </div>
    </form>
</template>

<script>

import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng';
import es from './langs/IndexEsp';
import useVuelidate from '@vuelidate/core';
import { email, helpers, minLength, required } from '@vuelidate/validators';
import { ajax } from '../../utils/AjaxRequest.js';
import { useSignupStore } from '../../stores/SignUp.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    emits: ['goBack', 'goForward', 'response'],
    props: {
        email: String,
        isVisible: Boolean
    },
    setup(props, { emit }) {

        watch(() => [
            props.email,
            props.isVisible
        ], (newValue, oldValue) => {
            
            attrs.email.disabled = (newValue[1]) ? false : true;
            attrs.signUpBtn.disabled = (newValue[1]) ? false : true;
            data.email = newValue[0];

        });

        const signupStore = useSignupStore();
        const userAccountStore = useUserAccountStore();
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        const minLengthUsername = ref(5);

        const data = reactive({
            email: "",
            username: ""
        })

        const attrs = reactive({
            goBackBtn: {
                disabled: false
            },
            signUpBtn: {
                disabled: true,
                html: t('signUpBtn.text'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('signUpBtn.loadingText') +'</span>'
            },
            email: {
                disabled: true
            },
            username: {
                disabled: false,
                iconClass: "",
                searching: false
            }
        });

        const checkUserExist = () => {

            return new Promise(function(resolve, reject) { 

                data.username = data.username.replace(/\s+/g, '').toLowerCase()

                if(data.username.length >= minLengthUsername.value) {

                    attrs.username.searching = true

                    let ajaxData = {
                        method: "get",
                        params: {
                            username: data.username,
                            langId: userAccountStore.state.langId
                        },
                        url: import.meta.env.VITE_API_BASE_URL+"/users/check-username"
                    }

                    ajax(ajaxData)
                    .then(function (response) {

                        attrs.username.searching = false
                   
                        if(response.status === 200 && response.data) {

                            let available = (response.data.usernameAvailable === 1) ? true : false
                            attrs.username.iconClass = (available) ? "bi-check-circle-fill" : "bi-x-circle-fill"
                            resolve(available)

                        } else if(response.status === 200 && !response.data) {

                            throw {
                                message: response.data.message,
                                type: "warning"
                            }

                        } else {

                            throw {
                                close: true,
                                message: "Ocurrió un error al tratar de registrarte",
                                timer: true,
                                timerSeconds: 3,
                                type: "error"
                            }

                        }

                    })
                    .catch(error => {

                        attrs.signUpBtn.disabled = false;
                        attrs.signUpBtn.html =  t('signUpBtn.text');
                        attrs.username.iconClass = "bi-x-circle-fill";

                        if(error.message){
                            let alertData = {
                                close: (error.close) ? error.close : false,
                                message: error.message,
                                show: true,
                                timer: (error.timer) ? error.timer : false,
                                timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                                type: (error.type) ? error.type : "error"
                            }
                            //Object.assign(alertProps, alertData)
                        }

                        reject(false)

                    })

                } else {

                    attrs.username.iconClass = ""
                    resolve(true)

                }

            })
            
        };

        const noSpecialChars = helpers.regex(/^[0-9a-z_.]*$/);
        const rules = computed(() => ({
            email: {
                email: helpers.withMessage(t('validator.email'), email),
                required: helpers.withMessage(t('validator.required'), required)
            },
            username: {
                available: helpers.withMessage(t('inputs.username.notAvailable'), helpers.withAsync(checkUserExist)),
                minLength: helpers.withMessage(t('validator.minLength', { min: minLengthUsername.value }), minLength(minLengthUsername.value)),
                noSpecialChars: helpers.withMessage(t('validator.noSpecialChars'), noSpecialChars),
                required: helpers.withMessage(t('validator.required'), required)
            }
        }))
        const v$ = useVuelidate(rules, data);

        const goBack = () => {
            emit('goBack');
        };

        async function signup() {

            const isFormCorrect = await this.v$.$validate()
      
            if(isFormCorrect){
                
                attrs.email.disabled = true;
                attrs.goBackBtn.disabled = true;
                attrs.signUpBtn.disabled = true;
                attrs.signUpBtn.html =  attrs.signUpBtn.loadingHtml;
                attrs.username.disabled = true;
                
                let ajaxData = {
                    method: "post",
                    params: {
                        email: data.email,
                        langId: userAccountStore.state.langId,
                        username: data.username
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/sign-up"
                }
                
                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200) {

                        var message = response.data.message;
                        var timer = 0;
                        var typeMessage = response.data.status;

                        if(response.data.statusCode === 1) {
                                
                            attrs.signUpBtn.html = t('signUpBtn.text');
                          
                            localStorage.setItem("userAvatar", response.data.avatar);
                            localStorage.setItem("userEmail", response.data.email);
                            localStorage.setItem("userId", response.data.userId);
                            localStorage.setItem("username", response.data.username);
                            localStorage.setItem("userStatusId", response.data.userStatusId);

                            userAccountStore.$patch((store) => {
                                store.state.avatar = response.data.avatar,
                                store.state.email = data.email,
                                store.state.id = response.data.userId,
                                store.state.username = response.data.username,
                                store.state.userStatusId = response.data.userStatusId
                            });
                            
                        } else {

                            attrs.email.disabled = false;
                            attrs.goBackBtn.disabled = false;
                            attrs.signUpBtn.disabled = false;
                            attrs.signUpBtn.html = t('signUpBtn.text');
                            attrs.username.disabled = false;

                        }

                        let alertData = {
                            message: message,
                            show: true,
                            type: typeMessage
                        };
                        
                        let dataR = {
                            alertData: alertData,
                            statusCode: response.data.statusCode,
                            timer: timer
                        };
                    
                        emit("response", dataR);

                    } else {

                        throw {
                            message: t('alert.error'),
                            type: "warning"
                        }

                    }

                })
                .catch(error => {

                    attrs.email.disabled = false;
                    attrs.goBackBtn.disabled = false;
                    attrs.signUpBtn.disabled = false;
                    attrs.signUpBtn.html = t('signUpBtn.text');
                    attrs.username.disabled = false;

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: (error.message) ? error.message : t('loginBtn.text'),
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    };

                    let dataR = {
                        alertData: alertData
                    };
                    
                    emit("response", dataR);


                    if(error.message){
                        let alertData = {
                            close: (error.close) ? error.close : false,
                            message: error.message,
                            show: true,
                            timer: (error.timer) ? error.timer : false,
                            timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                            type: (error.type) ? error.type : "error"
                        }
                        //Object.assign(alertProps, alertData)
                    }

                })

            }

        }

        return {
            attrs,
            checkUserExist,
            data,
            goBack,
            signup,
            t,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signUp/Index.less" scoped></style>