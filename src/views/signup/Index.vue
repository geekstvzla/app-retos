<template>
    <form>
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
            <div class="error-msg" v-for="error of v$.email.$errors" :key="error.$uid">
                <p>{{ error.$message }}</p>
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
                        @click="login"
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
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    emits: ['goBack', 'response'],
    props: {
        email: String,
        isVisible: Boolean
    },
    setup(props, { emit }) {

        watch(() => [
            props.isVisible
        ], (newValue, oldValue) => {
          
            attrs.email.disabled = (newValue[0]) ? false : true;
            attrs.requestAccessCodeButton.disabled = (newValue[0]) ? false : true;

        });

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
                html: "",
                initHtml: t('signUpBtn.initText'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('signUpBtn.loadingText') +'</span>'
            },
            email: {
                disabled: true
            },
            username: {
                disabled: true,
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
                        attrs.signUpBtn.html =  attrs.signUpBtn.initHtml;
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
      
                attrs.signUpBtn.disabled = true
                attrs.signUpBtn.html =  attrs.signUpBtn.loadingHtml
                
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
               
                    if(response.status === 200 && response.data) {

                        attrs.signUpBtn.disabled = false;
                        attrs.signUpBtn.html =  attrs.signUpBtn.initHtml;

                        if(response.data.statusCode === 1) {

                            data.email = "";
                            data.username = "";

                            v$.value.$reset();

                            var message = t('alert.success');
                            var typeMessage = "success";

                        } else if(response.data.statusCode === 2) {

                            var message = t('alert.warning');
                            var typeMessage = "warning";

                        } else {

                            var message = t('alert.error');
                            var typeMessage = "warning";

                        }

                        let alertData = {
                            message: message,
                            show: true,
                            type: typeMessage
                        };
                        //Object.assign(alertProps, alertData);

                    } else if(response.status === 200 && !response.data) {

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

                    attrs.signUpBtn.disabled = false
                    attrs.signUpBtn.html =  attrs.signUpBtn.initHtml

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
            userAccountStore,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signUp/Index.less" scoped></style>