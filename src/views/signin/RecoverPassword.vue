<template>
    <div class="fade modal" id="recoverPassword" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ translation.signIn.modalRecoverPassword.title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>{{ translation.signIn.modalRecoverPassword.legend }}</p>
                    <form>
                        <div :class=" (v$.email.$errors.length > 0) ? 'field-error mb-2' : 'mb-2'">
                            <label class="form-label">{{ translation.signIn.modalRecoverPassword.inputs.email.label }}</label>
                            <input :disabled="attrs.email.disabled"
                                   class="form-control"
                                   type="text"
                                   v-model="data.email">
                            <div class="error-msg" v-for="error of v$.email.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <Alert :options="alertProps" />
                    <button type="button" class="btn btn-outline" data-bs-dismiss="modal">{{ translation.signIn.modalRecoverPassword.btnClose }}</button>
                    <button :disabled="attrs.recoverButton.disabled"
                            @click="recoverPassword"
                            class="btn btn-filled btn-recover"
                            type="button"
                            v-html="attrs.recoverButton.html"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive } from 'vue'
import Alert from '../../components/Alert.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { useTranslatorStore } from '../../stores/Translator.js'
import { useEncryptionStore } from '../../stores/encryption.js'
import { useUserAccountStore } from '../../stores/UserAccount.js'
import { ajax } from '../../utils/AjaxRequest'

export default defineComponent({
    components: {
        Alert
    },
    setup() {

        onMounted(() => {
            attrs.recoverButton.html = attrs.recoverButton.initHtml
            attrs.recoverButton.disabled = false
            attrs.email.disabled = false
            modalOnClose()
        })

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        })
        const encryptionStore = useEncryptionStore()
        const userAccountStore = useUserAccountStore()
        const translation = useTranslatorStore().translation(userAccountStore.state.langId)

        const data = reactive({
            email: ""
        })

        const attrs = reactive({
            recoverButton:{
                disabled: true,
                html: "",
                initHtml: translation.signIn.modalRecoverPassword.btnInitText,
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ translation.signIn.modalRecoverPassword.btnLoadingText +'</span>'
            },
            email: {
                disabled: true
            }
        });

        const rules = {
            email: { required: helpers.withMessage(translation.validator.required, required) }
        }

        const v$ = useVuelidate(rules, data)

        async function recoverPassword() {

            alertProps.show = false

            let isFormCorrect = await this.v$.$validate()
            if(isFormCorrect){

                attrs.recoverButton.disabled = true
                attrs.recoverButton.html =  attrs.recoverButton.loadingHtml

                let ajaxData = {
                    method: "post",
                    params: {
                        email: encryptionStore.encrypt(data.email),
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/recover-user-password"
                }

                ajax(ajaxData)
                .then(function (response) {

                    if(response.data.response.statusCode === 1) {

                        attrs.recoverButton.html =  attrs.recoverButton.initHtml

                        let alertData = {
                            close: true,
                            message: translation.signIn.modalRecoverPassword.alert.success,
                            show: true,
                            type: "success"
                        }
                        Object.assign(alertProps, alertData)

                    } else if(response.data.response.statusCode === 0) {

                        throw {
                            message: translation.signIn.modalRecoverPassword.alert.invalidEmail,
                            type: "warning"
                        }

                    } else {

                        throw {
                            close: true,
                            message: translation.signIn.modalRecoverPassword.alert.error,
                            timer: true,
                            timerSeconds: 3,
                            type: "error"
                        }

                    }

                })
                .catch(error => {

                    attrs.recoverButton.disabled = false
                    attrs.recoverButton.html =  attrs.recoverButton.initHtml

                    if(error.message) {

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

        }

        const modalOnClose = () => {

            let modal = document.getElementById('recoverPassword')
            modal.addEventListener('hidden.bs.modal', event => {

                alertProps.show = false
                attrs.recoverButton.disabled = false
                data.email = ""

                v$.value.$reset()

            })

        }

        return {
            alertProps,
            attrs,
            data,
            encryptionStore,
            recoverPassword,
            translation,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signIn/RecoverPassword.less" scoped></style>