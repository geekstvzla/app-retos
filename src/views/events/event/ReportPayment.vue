<template>
    <div class="row wrapper-report-payment">
        <div class="col">
            <div class="report-payment-data">
                <h2 class="title">Reporta tu pago</h2>
                <div v-if="props.paymentmethodId !== null">
                    <p class="mb-3">Por favor, complete el formulario para reportar su pago.</p>
                    <form>
                        <div :class=" (v$.paymentDay.$errors.length > 0) ? 'field-error mb-3' : 'mb-3'">
                            <label for="paymentDay" class="form-label">Fecha en que realizó el pago</label>
                            <VueDatePicker cancel-text="Cerrar"
                                           :config="{ closeOnScroll: 'true' }"
                                           :enable-time-picker="false" 
                                           hide-offset-dates
                                           locale="es" 
                                           :max-date="new Date()"
                                           select-text="Seleccionar"
                                           :teleport="true"
                                           :ui="{ input: 'form-control' }"
                                           v-model="data.paymentDay"/>
                            <div class="error-msg" v-for="error of v$.paymentDay.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class=" (v$.operationNumber.$errors.length > 0) ? 'field-error mb-3' : 'mb-3'">
                            <label for="operationNumber" class="form-label">Número o referencia de la operación</label>
                            <input @keydown.prevent="!isAlphaNumeric($event.key)"
                                   @paste.prevent 
                                   @drop.prevent
                                   class="form-control"
                                   type="text" 
                                   v-model.trim="data.operationNumber">
                            <span id="operationNumberHelp" class="form-text">
                                Caracteres permitidos: letras (A-Z, a-z), números (0-9) y guiones (-)
                            </span>
                            <div class="error-msg" v-for="error of v$.operationNumber.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class=" (v$.voucherFile.$errors.length > 0) ? 'field-error mb-3' : 'mb-3'">
                            <label for="voucherFile" class="form-label">Subir comprobante de pago</label>
                            <input @change="handleVoucherFile" class="form-control" type="file">
                            <div class="error-msg" v-for="error of v$.voucherFile.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="alert alert-warning" v-else>
                    Debe seleccionar un método de pago para poder reportar su pago.
                </div>
            </div>  
        </div>
    </div>
</template>

<script>

import { defineComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './PersonalData/langs/PersonalDataEng.js';
import es from './PersonalData/langs/PersonalDataEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';
import '@vuepic/vue-datepicker/dist/main.css';

export default defineComponent({
    components: { 
        Alert,
        VueDatePicker 
    },
    props: {
        paymentmethodId: {
            type: Number,
            default: null
        }
    },
    setup(props) {

        const paymethods = ref([]);
        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const attrs = reactive({
            paymentMethod: {
                disabled: true
            }
        });
        
        const data = reactive({
            operationNumber: "",
            paymentMethodId: "",
            paymentDay: "",
            voucherFile: ""
        });
        const messages = {
            en: en,
            es: es
        };
        const paymentMethodDetailsData = ref([]);
        const { t } = useI18n({
            messages
        });  
        
        const eventStore = useEventStore();
        const rules = {
            operationNumber: { required: helpers.withMessage(t('validator.required'), required) },
            paymentDay: { required: helpers.withMessage(t('validator.required'), required) },
            voucherFile: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: props.scope });

        const handleVoucherFile = (event) => {

            const file = event.target.files[0];
            let extension = file.name.split('.').pop();
            data.voucherFile = file;

        };

        const isAlphaNumeric = (value) => {
            console.log(value);
            const regex = /^[a-zA-Z0-9-]+$/;
            console.log(regex.test(value));

            if (regex.test(value)) {
                data.operationNumber += value;
            }

        };

        const paymethodDetail = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: eventStore.state.editionId,
                    langId: userAccountStore.state.langId,
                    paymentMethodId: data.paymentMethodId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-edition-paymethod-detail/"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                 
                    if(rs.data.length > 0) {
                        paymentMethodDetailsData.value = rs.data;
                    }
                               
                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        return {
            alertProps,
            attrs,
            data,
            handleVoucherFile,
            isAlphaNumeric,
            paymethods,
            paymethodDetail,
            paymentMethodDetailsData,
            props,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/ReportPayment.less"></style>