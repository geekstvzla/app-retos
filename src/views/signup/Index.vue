<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-4">
                <h3 class="title">{{ translation.signUp.title }}</h3>
                <form>
                    <div :class=" (v$.email.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
                        <label class="form-label">{{ translation.signUp.inputs.email.label }}</label>
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
                  <div :class=" (v$.password.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
                      <label class="form-label">{{ translation.signUp.inputs.password.label }}</label>
                      <span class="input-group-text">
                          <i class="bi bi-lock"></i>
                      </span>
                      <input class="form-control"
                             :disabled="attrs.password.disabled"
                             id="password"
                             :type="attrs.password.type"
                             v-model.trim="v$.password.$model">
                     <span class="input-group-text">
                         <i @click="passwordType('password')" :class="'bi bi-'+attrs.password.seeClass"></i>
                     </span>
                      <div class="error-msg" v-for="error of v$.password.$errors" :key="error.$uid">
                          <p>{{ error.$message }}</p>
                      </div>
                  </div>
                  <div :class=" (v$.confirmPassword.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
                      <label class="form-label">{{ translation.signUp.inputs.confirmPassword.label }}</label>
                      <span class="input-group-text">
                          <i class="bi bi-lock"></i>
                      </span>
                      <input class="form-control"
                             :disabled="attrs.confirmPassword.disabled"
                             id="confirm-password"
                             :type="attrs.confirmPassword.type"
                             v-model="v$.confirmPassword.$model">
                     <span class="input-group-text">
                         <i @click="passwordType('confirmPassword')" :class="'bi bi-'+attrs.confirmPassword.seeClass"></i>
                     </span>
                      <div class="error-msg" v-for="error of v$.confirmPassword.$errors" :key="error.$uid">
                          <p>{{ error.$message }}</p>
                      </div>
                  </div>
                  <div :class=" (v$.username.$errors.length > 0) ? 'field-error input-group mb-2' : 'input-group mb-2'">
                      <label class="form-label">{{ translation.signUp.inputs.username.label }}</label>
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
                      <div id="usernameHelpBlock" class="form-text">
                          {{ translation.signUp.inputs.username.helpText }}
                      </div>
                      <div class="error-msg" v-for="error of v$.username.$errors" :key="error.$uid">
                          <p>{{ error.$message }}</p>
                      </div>
                  </div>
                  <div class="d-grid">
                      <button :disabled="attrs.saveButton.disabled"
                              @click="signup"
                              class="btn btn-filled"
                              id="btn-sign-up"
                              type="button"
                              v-html="attrs.saveButton.html"></button>
                      <Alert :options="alertProps" />
                  </div>
                  <div class="d-grid wrapper-sign-in">
                      <span class="text-center">{{ translation.signUp.haveAnAccount }}</span>
                      <router-link :to="{ name: 'sign-in' }" class="btn btn-sign-in">{{ translation.signUp.signIn }}</router-link>
                  </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators'
import Alert from '../../components/Alert.vue'
import { useTranslatorStore } from '../../stores/Translator.js'
import { useEncryptionStore } from '../../stores/encryption.js'
import { useUserAccountStore } from '../../stores/UserAccount.js'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { ajax } from '../../utils/AjaxRequest'

export default defineComponent({
    components: {
        Alert
    },
    setup() {

        onMounted(() => {
            attrs.saveButton.html = attrs.saveButton.initHtml
            attrs.saveButton.disabled = false
            attrs.email.disabled = false
            attrs.password.disabled = false
            attrs.confirmPassword.disabled = false
            attrs.username.disabled = false
        })

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        })

        const encryptionStore = useEncryptionStore()
        const minLengthUsername = ref(5)
        const route = useRoute()
        const userAccountStore = useUserAccountStore()
        const translation = useTranslatorStore().translation(userAccountStore.state.langId)

        const data = reactive({
            email: "",
            password: "",
            confirmPassword: "",
            username: ""
        })

        const attrs = reactive({
            saveButton: {
                disabled: true,
                html: "",
                initHtml: translation.signUp.btnInitText,
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+translation.signUp.btnLoadingText+'</span>'
            },
            confirmPassword: {
                disabled: true,
                seeClass: "eye",
                type: "password"
            },
            email: {
                disabled: true
            },
            password: {
                disabled: true,
                seeClass: "eye",
                type: "password"
            },
            username: {
                disabled: true,
                iconClass: "",
                searching: false
            }
        });

        onBeforeRouteLeave((to, from, next) => {
            alertProps.show = false
            next();
        })

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
                        
                        if(response.status === 200 && response.data.response) {

                            let available = (response.data.response.usernameAvailable === 1) ? true : false
                            attrs.username.iconClass = (available) ? "bi-check-circle-fill" : "bi-x-circle-fill"
                            resolve(available)

                        } else if(response.status === 200 && !response.data.response) {

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

                        attrs.saveButton.disabled = false
                        attrs.saveButton.html =  attrs.saveButton.initHtml

                        if(error.message){
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

                        reject(false)

                    })

                } else {

                    attrs.username.iconClass = ""
                    resolve(true)

                }

            })
            
        }

        const noSpecialChars = helpers.regex(/^[0-9a-z_.]*$/)
        const rules = computed(() => ({
            email: {
                email: helpers.withMessage(translation.validator.email, email),
                required: helpers.withMessage(translation.validator.required, required)
            },
            password: {
                minLength: helpers.withMessage(translation.validator.minLength(8), minLength(8)),
                required: helpers.withMessage(translation.validator.required, required)
            },
            confirmPassword: {
                sameAs: helpers.withMessage(translation.validator.sameAs("contraseña"),sameAs(data.password))
            },
            username: {
                available: helpers.withMessage(translation.signUp.inputs.username.notAvailable, helpers.withAsync(checkUserExist)),
                minLength: helpers.withMessage(translation.validator.minLength(minLengthUsername.value), minLength(minLengthUsername.value)),
                noSpecialChars: helpers.withMessage(translation.validator.noSpecialChars, noSpecialChars),
                required: helpers.withMessage(translation.validator.required, required)
            }
        }))
        const v$ = useVuelidate(rules, data)

        async function signup() {

            alertProps.show = false
            const isFormCorrect = await this.v$.$validate()
      
            if(isFormCorrect){
      
                attrs.saveButton.disabled = true
                attrs.saveButton.html =  attrs.saveButton.loadingHtml
                
                let ajaxData = {
                    method: "post",
                    params: {
                        email: encryptionStore.encrypt(data.email),
                        langId: userAccountStore.state.langId,
                        password: encryptionStore.encrypt(data.password),
                        username: encryptionStore.encrypt(data.username)
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/sign-up"
                }
                
                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200 && response.data.response) {

                        attrs.saveButton.disabled = false
                        attrs.saveButton.html =  attrs.saveButton.initHtml

                        if(response.data.response.statusCode === 1) {

                            data.email = ""
                            data.password = ""
                            data.confirmPassword = ""
                            data.username = ""

                            v$.value.$reset()

                            var message = translation.signUp.alert.success
                            var typeMessage = "success"

                        } else if(response.data.response.statusCode === 2) {

                            var message = translation.signUp.alert.warning
                            var typeMessage = "warning"

                        } else {

                            var message = translation.signUp.alert.error
                            var typeMessage = "warning"

                        }

                        let alertData = {
                            message: message,
                            show: true,
                            type: typeMessage
                        }
                        Object.assign(alertProps, alertData)

                    } else if(response.status === 200 && !response.data.response) {

                        throw {
                            message: translation.signUp.alert.error,
                            type: "warning"
                        }

                    } else {

                        throw {
                            close: true,
                            message: translation.signUp.alert.error,
                            timer: true,
                            timerSeconds: 3,
                            type: "error"
                        }

                    }

                })
                .catch(error => {

                    attrs.saveButton.disabled = false
                    attrs.saveButton.html =  attrs.saveButton.initHtml

                    if(error.message){
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

        const passwordType = (input) => {
            attrs[input].type = (attrs[input].type === "password") ? "text" : "password"
            attrs[input].seeClass = (attrs[input].type === "password") ? "eye" : "eye-slash"
        }

        return {
            alertProps,
            attrs,
            checkUserExist,
            data,
            encryptionStore,
            passwordType,
            route,
            signup,
            translation,
            userAccountStore,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/signup/Index.less" scoped></style>