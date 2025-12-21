<template>
    <div class="modal fade" id="modal-no-session" tabindex="-1" aria-labelledby="modal-no-session-label" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modal-no-session-label">Tus datos personales</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong class="subtitle">Tu información personal se utilizará para saber a nombre de quien está la inscripción.</strong></p>
                <p>Debes iniciar sesión en tu cuenta de <b>sumandokilometros.com.ve</b> para poder ver y/o editar tu información personal.</p>
                <p>Si no tienes una cuenta, puedes crear una de forma gratuita haciendo clic en el siguiente enlace:</p>
            </div>
            <div class="modal-footer">
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
import { helpers, numeric, required } from '@vuelidate/validators';
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

            const regex = /^[ \p{Letter}'’]+$/u; 
            return regex.test(value);

        };

        const rules = {
            firstName: { 
                alpha: helpers.withMessage(t('validator.alpha'), validName),
                required: helpers.withMessage(t('validator.required'), required) 
            },
            middleName: { 
                alpha: helpers.withMessage(t('validator.alpha'), validName),
            },
            lastName: { 
                alpha: helpers.withMessage(t('validator.alpha'), validName),
                required: helpers.withMessage(t('validator.required'), required) 
            },
            secondLastName: { 
                alpha: helpers.withMessage(t('validator.alpha'), validName)
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
                    data.firstName = userData.first_name.trim();
                    data.document = userData.document_id;
                    data.documentTypeId = userData.document_type_id;
                    data.emergencyPhoneNumber = userData.emergency_phone_number;
                    data.genderId = userData.gender_id;
                    data.lastName = userData.last_name.trim();
                    data.medicalCondition = userData.medical_condition;
                    data.middleName = userData.middle_name.trim();
                    data.phoneNumber = userData.phone_number;
                    data.secondLastName = userData.second_last_name.trim();

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
                        userId: userAccountStore.state.id,
                        email: userAccountStore.state.email,
                        firstName: data.firstName,
                        middleName: data.middleName,
                        lastName: data.lastName,
                        secondLastName: data.secondLastName,
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
                next();

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
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../../assets/less/events/event/PersonalData/ModalForm.less"></style>