<template>
    <div class="row wrapper-personal-data">
        <div class="col">
            <div class="personal-data">
                <h2 class="title">¿Quieres participar?</h2>
                <button type="button" class="btn btn-filled" data-bs-toggle="modal" data-bs-target="#personalDataModal">
                    Ver tu información personal
                </button>
            </div>
        </div>
    </div>
    <div class="modal fade" id="personalDataModal" tabindex="-1" aria-labelledby="personalDataModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="personalDataModalLabel">Tus datos personales</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong class="subtitle">Tu información personal se utilizará para saber a nombre de quien está la inscripción.</strong></p>
                <form class="row">
                    <div :class=" (v$.firstName.$errors.length > 0) ? 'field-error mb-4 col-md-6' : 'mb-4 col-md-6'">
                        <label for="firstName" class="form-label">Primer nombre</label>
                        <input class="form-control"
                               :disabled="attrs.firstName.disabled"
                               id="firstName"
                               type="text"
                               v-model="data.firstName">
                        <div class="error-msg" v-for="error of v$.firstName.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.middleName.$errors.length > 0) ? 'field-error mb-4 col-md-6' : 'mb-4 col-md-6'">
                        <label for="middleName" class="form-label">Segundo nombre</label>
                        <input class="form-control"
                               :disabled="attrs.middleName.disabled"
                               id="middleName"
                               type="text"
                               v-model="data.middleName">
                        <div class="error-msg" v-for="error of v$.middleName.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.lastName.$errors.length > 0) ? 'field-error mb-4 col-md-6' : 'mb-4 col-md-6'">
                        <label for="lastName" class="form-label">Primer apellido</label>
                        <input class="form-control"
                               :disabled="attrs.lastName.disabled"
                               id="lastName"
                               type="text"
                               v-model="data.lastName">
                        <div class="error-msg" v-for="error of v$.lastName.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.secondLastName.$errors.length > 0) ? 'field-error mb-4 col-md-6' : 'mb-4 col-md-6'">
                        <label for="secondLastName" class="form-label">Segundo apellido</label>
                        <input class="form-control"
                               :disabled="attrs.secondLastName.disabled"
                               id="secondLastName"
                               type="text"
                               v-model="data.secondLastName">
                        <div class="error-msg" v-for="error of v$.secondLastName.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.documentTypeId.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="documentType" class="form-label">Número de cédula</label>
                        <div class="input-group">
                            <select class="form-select"
                                    :disabled="attrs.documentTypeId.disabled" 
                                    id="documentType"
                                    v-model="data.documentTypeId">
                                <option selected value=""> - </option>
                                <option :value="item.document_type_id" v-for="(item, index) in documentTypes">{{ item.document_type }}</option>
                            </select>
                            <input class="form-control"
                                   :disabled="attrs.document.disabled"
                                   id="document"
                                   type="text"
                                   v-model="data.document">
                        </div>
                        <div class="error-msg" v-for="error of v$.documentTypeId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.birthday.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="birthday" class="form-label">Fecha de nacimiento</label>
                        <input class="form-control"
                               :disabled="attrs.birthday.disabled"
                               id="birthday"
                               type="text"
                               v-model="data.birthday">
                        <div class="error-msg" v-for="error of v$.birthday.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.genderId.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="gender" class="form-label">Sexo</label>
                        <select class="form-select"
                                :disabled="attrs.gender.disabled" 
                                id="gender"
                                v-model="data.genderId">
                            <option selected value="">Seleccione...</option>
                            <option :value="item.gener_type_id" v-for="(item, index) in genders">{{ item.gender }}</option>
                        </select>
                        <div class="error-msg" v-for="error of v$.genderId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.bloodTypeId.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="bloodType" class="form-label">Tipo de sangre</label>
                        <select class="form-select"
                                :disabled="attrs.bloodType.disabled" 
                                id="bloodType"
                                v-model="data.bloodTypeId">
                            <option selected value="">Seleccione...</option>
                            <option :value="item.blood_type_id" v-for="(item, index) in bloodTypes">{{ item.blood_type }}</option>
                        </select>
                        <div class="error-msg" v-for="error of v$.bloodTypeId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.phoneNumber.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="phoneNumber" class="form-label">Teléfono móvil</label>
                        <input class="form-control"
                               :disabled="attrs.phoneNumber.disabled"
                               id="phoneNumber"
                               type="text"
                               v-model="data.phoneNumber">
                        <div class="error-msg" v-for="error of v$.phoneNumber.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.emergencyPhoneNumber.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="emergencyPhoneNumber" class="form-label">Teléfono móvil de emergencia</label>
                        <input class="form-control"
                               :disabled="attrs.emergencyPhoneNumber.disabled"
                               id="emergencyPhoneNumber"
                               type="text"
                               v-model="data.emergencyPhoneNumber">
                        <div class="error-msg" v-for="error of v$.emergencyPhoneNumber.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.medicalCondition.$errors.length > 0) ? 'field-error mb-4 col-12' : 'mb-4 col-12'">
                        <label for="medicalCondition" class="form-label">¿Es alérgico a algún medicamento, alimento, mordedura o picada de animales o insectos, tiene alguna condición médica o discapacidad que debamos saber?</label>
                        <textarea class="form-control" :disabled="attrs.medicalCondition.disabled" id="medicalCondition" rows="3" v-model="data.medicalCondition"></textarea>
                        <div class="error-msg" v-for="error of v$.medicalCondition.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-filled" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" 
                        class="btn btn-filled" 
                        @click="save" 
                        :disabled="attrs.save.disabled">{{ attrs.save.html }}</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default defineComponent({
    setup() {

        const attrs = reactive({
            birthday: {
                disabled: false
            },
            bloodType: {
                disabled: false
            },
            document: {
                disabled: false
            },
            documentTypeId: {
                disabled: false
            },
            emergencyPhoneNumber: {
                disabled: false
            },
            gender: {
                disabled: false
            },
            firstName: {
                disabled: false
            },
            lastName: {
                disabled: false
            },
            phoneNumber: {
                disabled: false
            },
            medicalCondition: {
                disabled: false
            },
            middleName: {
                disabled: false
            },   
            save: {
                disabled: false,
                html: "Guardar",
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> Guardando</span>'
            },
            secondLastName: {
                disabled: false
            }
        });
        const bloodTypes = ref([]);
        const data = reactive({
            firstName: "",
            middleName: "",
            lastName: "",
            secondLastName: "",
            documentTypeId: "",
            document: "",
            birthday: "",
            genderId: "",
            bloodTypeId: "",
            phoneNumber: "",
            emergencyPhoneNumber: "",
            medicalCondition: ""
        });

        const departureDate = ref(null);
        const documentTypes = ref([]);
        const genders = ref([]);
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });
        const eventStore = useEventStore();
        const rules = {
            firstName: { required: helpers.withMessage(t('validator.required'), required) },
            middleName: { required: helpers.withMessage(t('validator.required'), required) },
            lastName: { required: helpers.withMessage(t('validator.required'), required) },
            secondLastName: { required: helpers.withMessage(t('validator.required'), required) },
            documentTypeId: { required: helpers.withMessage(t('validator.required'), required) },
            document: { required: helpers.withMessage(t('validator.required'), required) },
            birthday: { required: helpers.withMessage(t('validator.required'), required) },
            genderId: { required: helpers.withMessage(t('validator.required'), required) },
            bloodTypeId: { required: helpers.withMessage(t('validator.required'), required) },
            phoneNumber: { required: helpers.withMessage(t('validator.required'), required) },
            emergencyPhoneNumber: { required: helpers.withMessage(t('validator.required'), required) },
            allergies: { required: helpers.withMessage(t('validator.required'), required) },
            medicalCondition: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: false });

        const dateFormat = (dateString) => {

            var format = "";
            var locale = "";

            if(userAccountStore.state.langId === "esp") {
                format = "DD MMMM YYYY hh:mm a";
                locale = "es";
            } else {
                format = "MMMM D, YYYY";
                locale = "en";
            }

            return dayjs(dateString).locale(locale).format(format);

        };

        const getBloodTypes = () => {

            let ajaxData = {
                method: "get",
                params: {
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/get-blood-types"
            };

            ajax(ajaxData)
            .then(function (rs) {

                if(rs.status === 200 && rs.data) {
                    console.log(rs.data)
                    bloodTypes.value = rs.data.bloodTypes;

                };

            })
            .catch(error => {

                console.log(error);

            });

        };
        
        const getDocumentTypes = () => {

            let ajaxData = {
                method: "get",
                params: {
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/get-document-types"
            };

            ajax(ajaxData)
            .then(function (rs) {

                if(rs.status === 200 && rs.data) {
                    console.log(rs.data)
                    documentTypes.value = rs.data.documentTypes;
                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const getGenderTypes = () => {

            let ajaxData = {
                method: "get",
                params: {
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/get-gender-types"
            };

            ajax(ajaxData)
            .then(function (rs) {

                if(rs.status === 200 && rs.data) {
                    console.log(rs.data)
                    genders.value = rs.data.genderTypes;

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const getPersonalData = () => {

            let ajaxData = {
                method: "get",
                params: {
                    userId: userAccountStore.state.id,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/get-user-data"
            };

            ajax(ajaxData)
            .then(function (rs) {

                if(rs.status === 200 && rs.data) {
                    console.log("=====================")
                    console.log(rs.data)
                    let userData = rs.data.userData;
                    data.firstName = userData.first_name;
                    data.document = userData.document_id;

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        async function save() {
            
            let isFormCorrect = await v$.value.$validate();

            const indexs = Object.keys(attrs);

            if(isFormCorrect) {

                indexs.forEach((index) => {
                    attrs[index].disabled = true;
                });

                attrs.save.html = attrs.save.loadingHtml;
                
                let ajaxData = {
                    method: "post",
                    params: {
                        userId: serAccountStore.state.id,
                        firstName: data.firstName,
                        middleName: data.firstName,
                        lastName: data.lastName,
                        secondLastName: data.secondLastName,
                        documentTypeId: data.documentTypeId,
                        document: data.document,
                        birthday: data.birthday,
                        genderId: data.genderId,
                        bloodTypeId: data.bloodTypeId,
                        phoneNumber: data.phoneNumber,
                        emergencyPhoneNumber: data.emergencyPhoneNumber,
                        medicalCondition: data.medicalCondition,
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/update-user-data"
                };

                ajax(ajaxData)
                .then(function (response) {
                  
                    /*attrs.email.disabled = false;
                    attrs.requestAccessCodeButton.disabled = false;
                    attrs.requestAccessCodeButton.html = t('getAccessCodeBtn.text');
                   
                    if(response.status === 200) {

                        var message = response.data.message;
                        var typeMessage = response.data.status;
                       
                        if(response.data.statusCode === 1) {
                           
                            attrs.requestAccessCodeButton.disabled = true;
                          
                        } else if(response.data.statusCode === 4) { // Error con el servidor de correo

                            throw {
                                message: t('alert.error.emailNoConnction'),
                                type: "error"
                            };

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

                    };*/

                })
                .catch(error => {

                    /*let alertData = {
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
                    */

                });

            };

        };

        onBeforeMount(() => {

            getBloodTypes();
            getDocumentTypes();
            getGenderTypes();
            getPersonalData();
            
        });

        return {
            attrs,
            bloodTypes,
            data,
            documentTypes,
            genders,
            rules,
            save,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/PersonalData.less"></style>