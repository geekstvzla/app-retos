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
import en from './langs/AccessCodeFormEng';
import es from './langs/AccessCodeFormEsp';
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

                    attrs.goBackBtn.disabled = false;
                    attrs.loginBtn.disabled = false;
                    attrs.loginBtn.html = t('loginBtn.text');

                    if(response.status === 200) {

                        var message = response.data.message;
                        var typeMessage = response.data.status;

                        if(response.data.statusCode === 1) {
                            
                            attrs.loginBtn.disabled = true;

                        };

                        let alertData = {
                            message: message,
                            show: true,
                            type: typeMessage
                        };

                        let dataR = {
                            alertData: alertData,
                            userData: response.data.userData,
                            statusCode: response.data.statusCode
                        };
                    
                        emit("response", dataR);

                    } else {

                        throw {
                            message: t('alert.error'),
                            type: "error"
                        };

                    };

                })
                .catch(error => {

                    attrs.loginBtn.disabled = false;
                    attrs.loginBtn.html =  t('loginBtn.text');

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

                });

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