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
                        class="btn"
                        id="btn-sign-in"
                        type="button">{{ t('backBtn') }}</button>
                <button :disabled="attrs.activationBtn.disabled"
                        @click="activate"
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
                disabled: true
            },
            activationBtn: {
                disabled: true,
                html: t('activationBtn.text'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('activationBtn.loadingText') +'</span>'
            },
            code: {
                disabled: true
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

        async function activate() {

            const isFormCorrect = await this.v$.$validate()
      
            if(isFormCorrect){
                
                attrs.code.disabled = true;
                attrs.goBackBtn.disabled = true;
                attrs.activationBtn.disabled = true;
                attrs.activationBtn.html =  attrs.activationBtn.loadingHtml;
                
                let ajaxData = {
                    method: "post",
                    params: {
                        code: data.code,
                        langId: userAccountStore.state.langId,
                        userId: userAccountStore.state.id
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/activate-user-account"
                }
                
                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200) {

                        var message = response.data.message;
                        var timer = 0;
                        var typeMessage = response.data.status;

                        attrs.goBackBtn.disabled = false;
                        attrs.activationBtn.html = t('activationBtn.text');

                        if(response.data.statusCode !== 1) {
                                
                            attrs.code.disabled = false;
                            attrs.activationBtn.disabled = false;
                            
                        }

                        let alertData = {
                            message: message,
                            show: true,
                            type: typeMessage
                        };
                        
                        let dataR = {
                            alertData: alertData,
                            statusCode: response.data.statusCode,
                            timer: timer,
                            userData: response.data.userData
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

                    attrs.code.disabled = false;
                    attrs.goBackBtn.disabled = false;
                    attrs.activationBtn.disabled = false;
                    attrs.activationBtn.html = t('activationBtn.text');

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: (error.message) ? error.message : t('activationBtn.text'),
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

        watch(() => userAccountStore.state.id, (newVal, oldVal) => {
   
            attrs.code.disabled = (newVal !== null && newVal !== '') ? false : true;
            attrs.goBackBtn.disabled = (newVal !== null && newVal !== '') ? false : true;
            attrs.activationBtn.disabled = (newVal !== null && newVal !== '') ? false : true;
            
        });

        return {
            attrs,
            data,
            goBack,
            activate,
            t,
            userAccountStore,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signUp/ActivationCode.less" scoped></style>