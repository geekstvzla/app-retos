<template>
    <form>
        <div class="d-grid leyend">
            {{ t('help') }}
        </div>
        <div :class=" (v$.code.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
            <label class="form-label">{{ t('inputs.code.label') }}</label>
            <span class="input-group-text">
                <i class="bi bi-key"></i>
            </span>
            <input class="form-control"
                   :disabled="attrs.code.disabled"
                   id="code"
                   type="text"
                   v-model.trim="v$.code.$model">
            <div class="wrapper-code-text">
                <div class="error-msg" v-for="error of v$.code.$errors" :key="error.$uid">
                    <p>{{ error.$message }}</p>
                </div>
            </div>
        </div>
        <div class="d-grid">
            <div class="btn-group" role="group">
                <button :disabled="attrs.goBackBtn.disabled"
                        @click="goBack"
                        class="btn"
                        id="btn-sign-in"
                        type="button">{{ t('backBtn') }}</button>
                <button :disabled="attrs.activationBtn.disabled"
                        @click="signup"
                        class="btn"
                        id="btn-sign-in"
                        type="button"
                        v-html="attrs.activationBtn.html"></button>
            </div>
        </div>
    </form>
</template>

<script>

import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/ActivationCodeEsp.js';
import es from './langs/ActivationCodeEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { ajax } from '../../utils/AjaxRequest.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    emits: ['goBack', 'response'],
    props: {
        isVisible: Boolean
    },
    setup(props, { emit }) {

        const userAccountStore = useUserAccountStore();
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        const data = reactive({
            code: ""
        })

        const attrs = reactive({
            goBackBtn: {
                disabled: false
            },
            activationBtn: {
                disabled: (userAccountStore.state.langId !== null) ? true : false,
                html: t('activationBtn.text'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('activationBtn.loadingText') +'</span>'
            },
            code: {
                disabled: (userAccountStore.state.langId !== null) ? true : false
            }
        });

        const rules = computed(() => ({
            code: {
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
                attrs.activationBtn.disabled = true;
                attrs.activationBtn.html =  attrs.activationBtn.loadingHtml;
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
                                
                            data.email = "";
                            data.username = "";
                            attrs.email.disabled = false;
                            attrs.goBackBtn.disabled = false;
                            attrs.activationBtn.disabled = false;
                            attrs.activationBtn.html = t('activationBtn.text');
                            attrs.username.disabled = false;
                            v$.value.$reset();
                            
                        } else {

                            attrs.email.disabled = false;
                            attrs.goBackBtn.disabled = false;
                            attrs.activationBtn.disabled = false;
                            attrs.activationBtn.html = t('activationBtn.text');
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
                    attrs.activationBtn.disabled = false;
                    attrs.activationBtn.html = t('activationBtn.text');
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

                });

            }

        }

        /*watch(() => [
            userAccountStore.state.langId
        ], (newValue, oldValue) => {
            console.log(oldValue)
            console.log("----------")
            console.log(newValue)
            attrs.code.disabled = (newValue[1] !== null) ? false : true;
            attrs.signUpBtn.disabled = (newValue[1] !== null) ? false : true;

        });*/

        return {
            attrs,
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

<style lang="less" src="../../assets/less/signUp/ActivationCode.less" scoped></style>