<template>
    <div class="row wrapper-modalities-sheet">
        <div class="col">
            <div class="modalities-sheet-data">
                <h2 class="title">¿Quieres participar?</h2>
                <form>
                    <div class="row mb-3">
                        <div class="col-6 mb-3">
                            <label for="mode" class="col-form-label">Modalidad</label>
                            <select @change="getModalityKits"
                                    class="form-select"
                                    :disabled="attrs.modalities.disabled" 
                                    id="mode"
                                    v-model="data.modality">
                                <option value="" disabled="disabled" v-if="modalities.length > 0">Seleccione</option>
                                <option :value="item.typeEventModeId" 
                                        v-for="(item, index) in modalities">{{ item.modality }}</option>
                            </select>
                            <span id="modalitiesHelp" class="form-text">
                                La modalidad en la cual se va a inscribir.
                            </span>
                        </div>
                        <div class="col-6 mb-3">
                            <label for="kits" class="col-form-label">Kit</label>
                            <select @change="getKitItems"
                                    class="form-select"
                                    :disabled="attrs.kits.disabled" 
                                    id="kit"
                                    v-model="data.kit">
                                <option disabled selected value="">Seleccione</option>
                                <option :value="item.kitId" v-for="(item, index) in kits">{{ item.kit }}</option>
                            </select>
                            <span id="kitsHelp" class="form-text">
                                Kit de participación.
                            </span>
                        </div>
                        <div class="col-12">
                            <label for="kits" class="col-form-label">¿Qué incluye?</label>
                            <div class="wrapper-kit-includes">
                                <span :class="'badge ' + item.class" v-for="(item, index) in kitItems">{{ item.desc }}</span>
                            </div>
                        </div>
                    </div>
                </form>  
            </div>  
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, numeric, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    components: { 
        Alert
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
            kits: {
                disabled: true
            },
            modalities: {
                disabled: false
            }
        });
        
        const data = reactive({
            kit: "",
            modality: ""
        });
        const kits = ref([]);
        const kitItemsDefault = {desc: "Seleccione el kit para mostrar lo que incluye.", class: "text-bg-warning"};
        const kitItems = ref([kitItemsDefault]);
        const messages = {
            en: en,
            es: es
        };
        const modalities = ref([]);
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
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: false });

        const getKitItems = () => {
           
            let ajaxData = {
                method: "get",
                params: {
                    kitId: data.kit,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/kit-items"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                    
                    kitItems.value = [];

                    rs.data.forEach(function(element, index) {
                        kitItems.value.push({"desc":element.item, "class": "text-bg-primary"});
                    });                    

                };

            })
            .catch(error => {

                console.log(error);

            });

        }

        const getModalities = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: eventStore.state.editionId,
                    eventId: eventStore.state.id,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-modalities"
            };

            ajax(ajaxData)
            .then(function (rs) {
              
                if(rs.status === 200 && rs.data) {
                   
                    modalities.value = rs.data;
                 
                    if(modalities.value.length === 1) {
                        
                        data.modality = modalities.value[0].typeEventModeId;
                        getModalityKits();

                    } else {

                        kitItems.value = [kitItemsDefault];

                    }

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const getModalityKits = () => {

            data.kit = "";
            kitItems.value = [kitItemsDefault];

            let ajaxData = {
                method: "get",
                params: {
                    langId: userAccountStore.state.langId,
                    typeEventModeId: data.modality
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-modality-kits"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
   
                    kits.value = rs.data;
                    attrs.kits.disabled = false

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

            getModalities();
            //getCountriesPhoneCodes();
            
        });

        onMounted(() => {

        });

        return {
            alertProps,
            attrs,
            data,
            getKitItems,
            getModalityKits,
            kits,
            kitItems,
            modalities,
            rules,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/Modalities.less"></style>