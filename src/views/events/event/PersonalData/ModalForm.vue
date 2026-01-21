<template>
    <div class="modal fade" id="modal-form" tabindex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modal-form-label">Tus datos personales</h1>
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
                    <div :class=" (v$.documentTypeId.$errors.length > 0 || v$.document.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="documentType" class="form-label">Número de cédula</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                 <select class="form-select"
                                        :disabled="attrs.documentTypeId.disabled" 
                                        id="documentType"
                                        v-model="data.documentTypeId">
                                    <option selected value=""> - </option>
                                    <option :value="item.document_type_id" v-for="(item, index) in documentTypes">{{ item.document_type }}</option>
                                </select>
                            </span>
                            <input class="form-control"
                                   :disabled="attrs.document.disabled"
                                   id="document"
                                   type="text"
                                   v-model="data.document">
                        </div>
                        <div class="error-msg" v-for="error of v$.documentTypeId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                        <div class="error-msg" v-for="error of v$.document.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div :class=" (v$.birthday.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="birthday" class="form-label">Fecha de nacimiento</label>
                        <VueDatePicker cancelText="Cerrar"
                                       :enable-time-picker="false"
                                       :disabled="attrs.birthday.disabled"
                                       :flow="birthdayFlow"
                                       :format="dateFormat"
                                       id="birthday"
                                       locale="es"
                                       :placeholder="attrs.birthday.placeholder"
                                       selectText="Seleccionar"
                                       teleport-center
                                       v-model="data.birthday"
                                       model-type="yyyy-MM-dd"
                                       :ui="{ input: 'form-control' }" />
                        <div class="error-msg" v-for="error of v$.birthday.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                        <div class="form-text">Ejemplo: {{ attrs.birthday.example }}</div>
                    </div>
                    <div :class=" (v$.genderId.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="gender" class="form-label">Sexo</label>
                        <select class="form-select"
                                :disabled="attrs.gender.disabled" 
                                id="gender"
                                v-model="data.genderId">
                            <option selected value="">Seleccione...</option>
                            <option :value="item.gender_type_id" v-for="(item, index) in genders">{{ item.gender }}</option>
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
                    <div :class=" (v$.countryPhoneCode.$errors.length > 0 || v$.phoneNumber.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="phoneNumber" class="form-label">Teléfono móvil (Whatsapp)</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                 <select class="form-select"
                                         :disabled="attrs.countryPhoneCode.disabled" 
                                         id="countryPhoneCode"
                                         v-model="data.countryPhoneCode">
                                    <option :value="item.phone_number_code" v-for="(item, index) in countriesPhoneCodes">{{ item.phone_number_code }}</option>
                                </select>
                            </span>
                            <input class="form-control"
                                   :disabled="attrs.phoneNumber.disabled"
                                   id="phoneNumber"
                                   type="text"
                                   v-model="data.phoneNumber">
                        </div>
                        <div class="error-msg" v-for="error of v$.countryPhoneCode.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                        <div class="error-msg" v-for="error of v$.phoneNumber.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                        <div class="form-text">Ejemplo: 04244422598.</div>
                    </div>
                    <div :class=" (v$.countryEmergencyPhoneCode.$errors.length > 0 || v$.emergencyPhoneNumber.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                        <label for="emergencyPhoneNumber" class="form-label">Teléfono móvil de emergencia</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <select class="form-select"
                                        :disabled="attrs.countryEmergencyPhoneCode.disabled" 
                                        id="countryEmergencyPhoneCode"
                                        v-model="data.countryEmergencyPhoneCode">
                                    <option :value="item.phone_number_code" v-for="(item, index) in countriesEmergencyPhoneCodes">{{ item.phone_number_code }}</option>
                                </select>
                            </span>
                            <input class="form-control"
                                   :disabled="attrs.emergencyPhoneNumber.disabled"
                                   id="emergencyPhoneNumber"
                                   type="text"
                                   v-model="data.emergencyPhoneNumber">
                        </div>
                        <div class="error-msg" v-for="error of v$.countryEmergencyPhoneCode.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                        <div class="error-msg" v-for="error of v$.emergencyPhoneNumber.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                        <div class="form-text">Ejemplo: 04244422598.</div>
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
                <Alert :options="alertProps" />
                <button type="button" class="btn btn-filled" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" 
                        class="btn btn-filled" 
                        @click="save" 
                        :disabled="attrs.save.disabled"
                        v-html="attrs.save.html"></button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../../utils/AjaxRequest.js';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, numeric, required, requiredIf } from '@vuelidate/validators';
import { useUserAccountStore } from '../../../../stores/UserAccount.js';
import { vMaska } from "maska/vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Alert from '../../../../components/Alert.vue';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    components: { 
        Alert,
        VueDatePicker 
    },
    setup() {

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const attrs = reactive({
            birthday: {
                disabled: false,
                example: "05/08/1975",
                placeholder: "día/mes/año"
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
            countryEmergencyPhoneCode: {
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
            countryPhoneCode: {
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
        
        const birthdayFlow = ref(['month', 'year', 'calendar']);
        const bloodTypes = ref([]);
        const countriesPhoneCodes = ref([]);
        const countriesEmergencyPhoneCodes = ref([]);
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
            countryPhoneCode: "",
            phoneNumber: "",
            countryEmergencyPhoneCode: "",
            emergencyPhoneNumber: "",
            medicalCondition: ""
        });
        const dateBirthdayMask = reactive({
            mask: '##/##/####',
            eager: false
        });
        const dateFormat = "dd/MM/yyyy";
        const documentTypes = ref([]);
        const genders = ref([]);
        const messages = {
            en: en,
            es: es
        };
        const modal = ref();
        const { t } = useI18n({
            messages
        });  
        
        const validName = (value) => {
          
            const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(?: [a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/;
            return (regex.test(value)) ? false : true;

        };

        const rules = {
            firstName: { 
                alpha: helpers.withMessage(t('validator.alphaWithSingleSpace'), validName),
                required: helpers.withMessage(t('validator.required'), required) 
            },
            middleName: { 
                alpha: {requiredIf: helpers.withMessage(t('validator.alphaWithSingleSpace'), requiredIf(() => {

                    if(data.middleName !== null) {

                        if(data.middleName.trim() !== '') {

                            return validName(data.middleName);

                        }

                    }

                    return false;

                }))}
            },
            lastName: { 
                alpha: helpers.withMessage(t('validator.alphaWithSingleSpace'), validName),
                required: helpers.withMessage(t('validator.required'), required) 
            },
            secondLastName: { 
                alpha: {requiredIf: helpers.withMessage(t('validator.alphaWithSingleSpace'), requiredIf(() => {

                        if(data.secondLastName !== null) {

                           if(data.secondLastName.trim() !== '') {

                               return validName(data.secondLastName);

                           }

                        }

                        return false;

                    }))}
            },
            documentTypeId: { required: helpers.withMessage(t('validator.required'), required) },
            document: { 
                numeric: helpers.withMessage(t('validator.numeric'), numeric), 
                required: helpers.withMessage(t('validator.required'), required) 
            },
            birthday: { required: helpers.withMessage(t('validator.required'), required) },
            genderId: { required: helpers.withMessage(t('validator.required'), required) },
            bloodTypeId: { required: helpers.withMessage(t('validator.required'), required) },
            countryPhoneCode: { required: helpers.withMessage(t('validator.countryPhoneCode'), required) },
            phoneNumber: { required: helpers.withMessage(t('validator.required'), required) },
            countryEmergencyPhoneCode: { required: helpers.withMessage(t('validator.countryPhoneCode'), required) },
            emergencyPhoneNumber: { required: helpers.withMessage(t('validator.required'), required) },
            medicalCondition: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: false });

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
                
                    bloodTypes.value = rs.data.bloodTypes;

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const getCountriesPhoneCodes = () => {

            let ajaxData = {
                method: "get",
                params: {
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/get-countries-phone-codes"
            };

            ajax(ajaxData)
            .then(function (rs) {

                if(rs.status === 200 && rs.data) {
   
                    countriesPhoneCodes.value = rs.data.phoneCodes;
                    countriesEmergencyPhoneCodes.value = rs.data.phoneCodes;

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

                    let userData = rs.data.userData;
                 
                    data.birthday = userData.birthday;
                    data.bloodTypeId = userData.blood_type_id;                    
                    data.countryEmergencyPhoneCode = userData.country_emergency_phone_code;
                    data.countryPhoneCode = userData.country_phone_code;
                    data.firstName = (userData.first_name !== null) ? userData.first_name.trim() : '';
                    data.document = userData.document_id;
                    data.documentTypeId = userData.document_type_id;
                    data.emergencyPhoneNumber = userData.emergency_phone_number;
                    data.genderId = userData.gender_id;
                    data.lastName = (userData.last_name !== null) ? userData.last_name.trim() : '';
                    data.medicalCondition = userData.medical_condition;
                    data.middleName = (userData.middle_name !== null) ? userData.middle_name.trim() : '';
                    data.phoneNumber = userData.phone_number;
                    data.secondLastName = (userData.second_last_name !== null) ? userData.second_last_name.trim() : '';

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const nameFormat = () => {
            
        }

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
                        userId: userAccountStore.state.id,
                        email: userAccountStore.state.email,
                        firstName: validatingName(data.firstName),
                        middleName: validatingName(data.middleName),
                        lastName: validatingName(data.lastName),
                        secondLastName: validatingName(data.secondLastName),
                        documentTypeId: data.documentTypeId,
                        document: data.document,
                        birthday: data.birthday,
                        genderId: data.genderId,
                        bloodTypeId: data.bloodTypeId,
                        countryPhoneCode: data.countryPhoneCode,
                        phoneNumber: data.phoneNumber,
                        countryEmergencyPhoneCode: data.countryEmergencyPhoneCode,
                        emergencyPhoneNumber: data.emergencyPhoneNumber,
                        medicalCondition: data.medicalCondition,
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/update-user-data"
                };
                
                ajax(ajaxData)
                .then(function (rs) {

                    indexs.forEach((index) => {
                        attrs[index].disabled = false;
                    });

                    attrs.save.html = "Guardar";
                   
                    if(rs.status === 200) {

                        var message = rs.data.message;
                        var typeMessage = rs.data.status;
                       
                        if(rs.data.statusCode === 4) { // Error con el servidor de correo

                            throw {
                                message: t('alert.error.emailNoConnction'),
                                type: "error"
                            };

                        };

                        let alertData = {
                            message: message,
                            show: true,
                            type: typeMessage
                        };
                        Object.assign(alertProps, alertData);
                     
                    } else {

                        throw {
                            message: t('alert.error.general'),
                            type: "error"
                        };

                    };

                })
                .catch(error => {

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: (error.message) ? error.message : t('alert.error.general'),
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    };

                    Object.assign(alertProps, alertData);
                    

                });

            };

        };

        const validatingName = (nameString) => {

            return nameString.trim().split(/\s+/).join(" ");

        }

        onBeforeMount(() => {

            getBloodTypes();
            getCountriesPhoneCodes();
            getDocumentTypes();
            getGenderTypes();
            
        });

        onMounted(() => {
            
            modal.value = new bootstrap.Modal('#modal-form');

            modal.value._element.addEventListener('hidden.bs.modal', event => {

                alertProps.show = false;

            });

            modal.value._element.addEventListener('shown.bs.modal', event => {

                getPersonalData();

            });

        });

        return {
            alertProps,
            attrs,
            birthdayFlow,
            bloodTypes,
            countriesPhoneCodes,
            countriesEmergencyPhoneCodes,
            data,
            dateBirthdayMask,
            dateFormat,
            documentTypes,
            genders,
            rules,
            save,
            t,
            v$,
            validatingName
        };

    }
})

</script>

<style lang="less" scoped src="../../../../assets/less/events/event/PersonalData/ModalForm.less"></style>