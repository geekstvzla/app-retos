<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-4">
                <h3 class="title">{{ translation.signIn.title }}</h3>
                <form>
                    <div :class=" (v$.email.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
                        <label class="form-label">{{ translation.signIn.inputs.email.label }}</label>
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
                  <div :class=" (v$.password.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
                      <label class="form-label">{{ translation.signIn.inputs.password.label }}</label>
                      <span class="input-group-text">
                          <i class="bi bi-lock"></i>
                      </span>
                      <input class="form-control"
                             :disabled="attrs.password.disabled"
                             id="password"
                             :type="attrs.password.type"
                             v-model="data.password">
                     <span class="input-group-text">
                         <i @click="passwordType" :class="'bi bi-'+attrs.password.seeClass"></i>
                     </span>
                      <div class="error-msg" v-for="error of v$.password.$errors" :key="error.$uid">
                          <p>{{ error.$message }}</p>
                      </div>
                  </div>
                  <div class="d-grid">
                      <button :disabled="attrs.saveButton.disabled"
                              @click="login"
                              class="btn btn-filled"
                              id="btn-sign-in"
                              type="button"
                              v-html="attrs.saveButton.html"></button>
                      <button class="btn btn-forgot-password"
                              data-bs-target="#recoverPassword"
                              data-bs-toggle="modal"
                              type="button">{{ translation.signIn.forgotYourPassword }}</button>
                      <Alert :options="alertProps" />
                  </div>
                  <div class="d-grid wrapper-sign-up">
                    <span class="text-center">{{ translation.signIn.areYouNotRegisteredYet }}</span>
                    <router-link :to="{ name: 'sign-up' }" class="btn btn-sign-up">{{ translation.signIn.signUp }}</router-link>
                  </div>
                </form>
            </div>
        </div>
        <RecoverPass />
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import Alert from '../../components/Alert.vue'
import RecoverPass from './RecoverPassword.vue'
import { useEncryptionStore } from '../../stores/encryption.js'
import { useTranslatorStore } from '../../stores/Translator.js'
import { useUserAccountStore } from '../../stores/UserAccount.js'
import { ajax } from '../../utils/AjaxRequest'

export default defineComponent({
    components: {
        Alert,
        RecoverPass
    },
    setup() {

        onMounted(() => {

            attrs.saveButton.html = attrs.saveButton.initHtml
            attrs.saveButton.disabled = false
            attrs.email.disabled = false
            attrs.password.disabled = false

            if(route.query.message) {

                let alertData = {
                    message: route.query.message,
                    show: true,
                    type: route.query.type_response
                }
                Object.assign(alertProps, alertData)

            }

        })

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        })
        const encryptionStore = useEncryptionStore()
        const route = useRoute()
        const router = useRouter()
        const userAccountStore = useUserAccountStore()
        const translation = useTranslatorStore().translation(userAccountStore.state.langId)

        const data = reactive({
            email: "",
            password: ""
        })
        
        const attrs = reactive({
            saveButton:{
                disabled: true,
                html: "",
                initHtml: translation.signIn.btnInitText,
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+translation.signIn.btnLoadingText+'</span>'
            },
            email: {
                disabled: true
            },
            password: {
                disabled: true,
                seeClass: "eye",
                type: "password"
            }
        });
        
        const rules = {
            email: { required: helpers.withMessage(translation.validator.required, required) },
            password: { required: helpers.withMessage(translation.validator.required, required) }
        }

        const v$ = useVuelidate(rules, data, { $scope: false })
        
        onBeforeRouteLeave((to, from, next) => {
            alertProps.show = false
            next();
        })

        async function login() {

            alertProps.show = false

            let isFormCorrect = await this.v$.$validate()
            if(isFormCorrect) {

                attrs.saveButton.disabled = true
                attrs.saveButton.html =  attrs.saveButton.loadingHtml
                
                let ajaxData = {
                    method: "post",
                    params: {
                        email: encryptionStore.encrypt(data.email),
                        langId: userAccountStore.state.langId,
                        password: encryptionStore.encrypt(data.password)
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/sign-in"
                }
              
                ajax(ajaxData)
                .then(function (response) {
                
                    if(response.status === 200 && response.data.response) {

                        if(response.data.response.statusCode === 1) {
                            
                            setTimeout(() => {
                                
                                sessionData(response.data.response)
                                router.push({ name: "home" });

                            }, 3000)

                        } else if(response.data.response.statusCode === 2) {

                            var message = response.data.response.message
                            var typeMessage = "warning"

                        } else if(response.data.response.statusCode === 3) {

                            var message = translation.signIn.alert.accountPendingVerification
                            var typeMessage = "warning"

                        } else if(response.data.response.statusCode === 4) {

                            var message = translation.signIn.alert.invalidPassword
                            var typeMessage = "warning"

                        } else {

                            var message = translation.signIn.alert.error
                            var typeMessage = "error"

                        }

                        if(response.data.response.statusCode !== 1) {

                            let alertData = {
                                message: message,
                                show: true,
                                type: typeMessage
                            }
                            Object.assign(alertProps, alertData)

                            attrs.saveButton.disabled = false
                            attrs.saveButton.html = attrs.saveButton.initHtml

                        }

                    } else if(response.status === 200 && !response.data.response) {

                        throw {
                            message: translation.signIn.alert.error,
                            type: "error"
                        }

                    } else {

                        throw {
                            close: true,
                            message: translation.signIn.alert.error,
                            timer: true,
                            timerSeconds: 3,
                            type: "error"
                        }
                        
                    }

                })
                .catch(error => {

                    attrs.saveButton.disabled = false
                    attrs.saveButton.html =  attrs.saveButton.initHtml

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

        const passwordType = () => {
            attrs.password.type = (attrs.password.type === "password") ? "text" : "password"
            attrs.password.seeClass = (attrs.password.type === "password") ? "eye" : "eye-slash"
        }

        const sessionData = (data) => {

            localStorage.setItem("userAvatar", data.avatar)
            localStorage.setItem("userId", data.userId)
            localStorage.setItem("userNickname", data.nickname)

            userAccountStore.$patch((store) => {
                store.state.avatar = data.avatar
                store.state.id = data.userId
                store.state.nickname = data.nickname
            })

        }

        return {
            alertProps,
            attrs,
            data,
            encryptionStore,
            login,
            passwordType,
            route,
            translation,
            userAccountStore,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signIn/Index.less" scoped></style>
../../stores/Translator.js