<template>
    <form>
        <div :class=" (v$.accessCode.$errors.length > 0) ? 'field-error mb-4' : 'mb-4'">
                <div class="input-group">
                    <label class="form-label">{{ t('inputs.accessCode.label') }}</label>
                    <span class="input-group-text">
                        <i class="bi bi-lock"></i>
                    </span>
                    <input class="form-control"
                           :disabled="attrs.accessCode.disabled"
                           id="access-code"
                           type="text"
                           v-model="data.accessCode">
                    <div class="error-msg" v-for="error of v$.accessCode.$errors" :key="error.$uid">
                        <p>{{ error.$message }}</p>
                    </div>
                </div>
                <div id="accessCodeHelpBlock" class="form-text">
                    {{ t('inputs.accessCode.help') }}
                </div>
        </div>
        <div class="d-grid">
            <div class="btn-group" role="group">
                <button :disabled="attrs.goBackBtn.disabled"
                        @click="goBack"
                        class="btn"
                        id="btn-sign-in"
                        type="button">{{ t('backBtn') }}</button>
                <button :disabled="attrs.loginBtn.disabled"
                        @click="login"
                        class="btn"
                        id="btn-sign-in"
                        type="button"
                        v-html="attrs.loginBtn.html"></button>
            </div>
        </div>
    </form>
</template>

<script>

import { defineComponent, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/AccessCodeFormEng.js';
import es from './langs/AccessCodeFormEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
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
           
            attrs.accessCode.disabled = (newValue[0]) ? false : true;
            attrs.loginBtn.disabled = (newValue[0]) ? false : true;

        });

        const userAccountStore = useUserAccountStore();
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        const data = reactive({
            accessCode: ""
        });
        
        const attrs = reactive({
            accessCode: {
                disabled: true
            },
            goBackBtn: {
                disabled: false
            },
            loginBtn: {
                disabled: false,
                html: t('loginBtn.text'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('loginBtn.loading') +'</span>'
            },
        });

        const rules = {
            accessCode: { required: helpers.withMessage(t('validator.required'), required) }
        };

        const v$ = useVuelidate(rules, data, { $scope: false });

        const goBack = () => {
            emit('goBack');
        };
        
        async function login() {

            let isFormCorrect = await v$.value.$validate();
            if(isFormCorrect) {

                attrs.goBackBtn.disabled = true;
                attrs.loginBtn.disabled = true;
                attrs.loginBtn.html = attrs.loginBtn.loadingHtml;
                
                let ajaxData = {
                    method: "post",
                    params: {
                        accessCode: data.accessCode,
                        email: props.email,
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/sign-in"
                };
              
                ajax(ajaxData)
                .then(function (response) {
                    console.log(response.data)

                    attrs.goBackBtn.disabled = false;
                    attrs.loginBtn.disabled = false;
                    attrs.loginBtn.html = t('loginBtn.text');

                    if(response.status === 200) {

                        if(response.data.response.statusCode === 1) {
                            
                            /*setTimeout(() => {
                                
                                sessionData(response.data.response)
                                router.push({ name: "home" })

                            }, 3000)*/

                        } else if(response.data.response.statusCode === 2) {

                            var message = response.data.response.message
                            var typeMessage = "warning"

                        } else if(response.data.response.statusCode === 3) {

                            var message = t('alert.accountPendingVerification')
                            var typeMessage = "warning"

                        } else {

                            var message = t('alert.error')
                            var typeMessage = "error"

                        }

                        if(response.data.response.statusCode !== 1) {

                            let alertData = {
                                message: message,
                                show: true,
                                type: typeMessage
                            }
                            //Object.assign(alertProps, alertData)

                           // attrs.loginBtn.disabled = false;
                            //attrs.loginBtn.html = t('loginBtn.text');

                        }

                    } else if(response.status === 200 && !response.data.response) {

                        throw {
                            message: t('alert.error'),
                            type: "error"
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

                    attrs.loginBtn.disabled = false;
                    attrs.loginBtn.html =  t('loginBtn.text');

                    if(error.message) {

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
            data,
            goBack,
            login,
            t,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signIn/AccessCodeForm.less" scoped></style>