<template>
    <form>
        <div :class=" (v$.email.$errors.length > 0) ? 'field-error  mb-4' : 'mb-4'">
            <div class="input-group">
                <label class="form-label">{{ t('inputs.email.label') }}</label>
                <span class="input-group-text">
                    <i class="bi bi-person"></i>
                </span>
                <input class="form-control"
                       :disabled="attrs.email.disabled"
                       id="email"
                       type="text"
                       v-model="data.email">
                <div class="error-msg" v-for="error of v$.email.$errors" :key="error.$uid">
                    <p>{{ error.$message }}</p>
                </div>
            </div>
            <div id="emailHelpBlock" class="form-text">
                {{ t('inputs.email.help') }}
            </div>
        </div>
        <div class="d-grid">
            <button :disabled="attrs.requestAccessCodeButton.disabled"
                    @click="getAccessCode"
                    class="btn btn-filled"
                    id="btn-get-access-code"
                    type="button"
                    v-html="attrs.requestAccessCodeButton.html"></button>
        </div>
    </form>
</template>

<script>

import { defineComponent, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/EmailFormEng';
import es from './langs/EmailFormEsp';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { ajax } from '../../utils/AjaxRequest.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    emits: ['response'],
    props: {
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

        const data = reactive({
            email: ""
        });
        
        const attrs = reactive({
            email: {
                disabled: false
            },
            requestAccessCodeButton: {
                disabled: false,
                html: t('getAccessCodeBtn.text'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('getAccessCodeBtn.loading') +'</span>'
            },
        });

        const rules = {
            email: { required: helpers.withMessage(t('validator.required'), required) }
        };

        const v$ = useVuelidate(rules, data, { $scope: false });
        
        async function getAccessCode() {
            
            let isFormCorrect = await v$.value.$validate();
            
            if(isFormCorrect) {

                attrs.email.disabled = true;
                attrs.requestAccessCodeButton.disabled = true;
                attrs.requestAccessCodeButton.html =  attrs.requestAccessCodeButton.loadingHtml;
                
                let ajaxData = {
                    method: "get",
                    params: {
                        email: data.email,
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/get-access-code"
                };

                ajax(ajaxData)
                .then(function (response) {
                    
                    attrs.email.disabled = false;
                    attrs.requestAccessCodeButton.disabled = false;
                    attrs.requestAccessCodeButton.html = t('getAccessCodeBtn.text');
                   
                    if(response.status === 200) {

                        var message = response.data.message;
                        var typeMessage = response.data.status;
                       
                        if(response.data.statusCode === 1) {
                           
                            attrs.requestAccessCodeButton.disabled = true;
                          
                        };
          
                        let alertData = {
                            message: message,
                            show: (response.data.statusCode !== 0) ? true : false,
                            type: typeMessage
                        };

                        let dataR = {
                            alertData: alertData,
                            email: data.email,
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

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: (error.message) ? error.message : t('getAccessCodeBtn.text'),
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

            };

        };

        return {
            attrs,
            data,
            getAccessCode,
            t,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signIn/EmailForm.less" scoped></style>