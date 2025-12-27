<template>
    <div class="row wrapper-report-payment">
        <div class="col">
            <div class="report-payment-data">
                <h2 class="title">Reporta tu pago</h2>
                <div v-if="props.paymentmethodId !== null">
                    <p class="mb-3">Por favor, complete el formulario para reportar su pago.</p>
                    <div class="mb-3">
                        <label for="paymentDay" class="form-label">Fecha en que realizó el pago</label>
                        <input type="text" class="form-control" id="paymentDay">
                    </div>
                    <div class="mb-3">
                        <label for="operationNumber" class="form-label">Número de operación o referencia bancaria</label>
                        <input type="text" class="form-control" id="operationNumber">
                    </div>
                    <div class="mb-3">
                        <label for="voucherFile" class="form-label">Subir comprobante de pago</label>
                        <input class="form-control" type="file" id="voucherFile">
                    </div>
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
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './PersonalData/langs/PersonalDataEng.js';
import es from './PersonalData/langs/PersonalDataEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, numeric, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';

export default defineComponent({
    components: { 
        Alert
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
            paymentMethodId: ""
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
            paymentMethodId: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: false });

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
                        console.log(paymentMethodDetailsData.value)
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