<template>
    <div class="row wrapper-report-payment">
        <div class="col">
            <div class="report-payment-data" v-if="(eventStore.state.typeId === 1)">
                <h2 class="title">Reporta tu pago</h2>
                <div v-if="eventStore.state.userEnroll.paymentMethodId !== null">
                    <p class="mb-3">Por favor, complete el formulario para reportar su pago.</p>
                    <form>
                        <div :class=" (v$.paymentDay.$errors.length > 0) ? 'field-error mb-3' : 'mb-3'">
                            <label for="paymentDay" class="form-label">Fecha en que realizó el pago</label>
                            <VueDatePicker auto-apply
                                           cancel-text="Cerrar"
                                           :config="{ closeOnScroll: 'true' }"
                                           :enable-time-picker="false" 
                                           hide-offset-dates
                                           @internal-model-change="getPaymentDay"
                                           locale="es" 
                                           :max-date="new Date()"
                                           model-type="yyyy-MM-dd"
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
                            <input @keydown="isAlphaNumeric"
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
                        <div :class="(v$.voucherFile.$errors.length > 0) ? 'field-error mb-3' : attrs.voucherFile.class">
                            <label for="voucherFile" class="form-label">Subir comprobante de pago</label>
                            <input @change="handleVoucherFile" class="form-control" id="voucher-file" type="file">
                            <span id="voucherFileHelp" class="form-text">
                                {{ attrs.voucherFile.help }}
                            </span>
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
            <div class="donation-event-data" v-else-if="(eventStore.state.typeId === 3)">
                 <h2 class="title">Evento pro fondos</h2>
                 <p class="mb-3">La actividad es gratuita sin embargo tiene un fin que es ayudar a otra persona; todo lo que pueda donar va directamente a la persona que lo necesita sin pasar por intermediarios.</p>
            </div>
            <div class="free-event-data" v-else>
                 CAMINATA GRATIS
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/ReportPaymentEng.js';
import es from './langs/ReportPaymentEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';
import '@vuepic/vue-datepicker/dist/main.css';

export default defineComponent({
    components: { 
        Alert,
        VueDatePicker 
    },
    props: {},
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
            },
            voucherFile: {
                class: "mb-3",
                help: ""
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
            operationNumber: { 
                onlyTheseCharacters: helpers.withMessage(t('validator.onlyTheseCharacters'), requiredIf((value) => {
                    
                    const regex = /^[a-zA-Z0-9-]+$/;
                    return regex.test(value);

                })),
                required: helpers.withMessage(t('validator.required'), requiredIf(() => {
                    return (eventStore.state.typeId === 1);
                })) 
            },
            paymentDay: { 
                required: helpers.withMessage(t('validator.required'), requiredIf(() => {
                    return (eventStore.state.typeId === 1);
                }))
            },
            voucherFile: { 
                onlyTheseExtensions: helpers.withMessage(t('validator.onlyTheseExtensions'), requiredIf((value) => {
                
                    const isValidImage = /\.(jpg|jpeg|png|pdf)$/i.test(value.name);
                    return isValidImage;

                })),
                required: helpers.withMessage(t('validator.required'), requiredIf(() => {
                    return (eventStore.state.typeId === 1);
                })) 
            }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: props.scope });

        const getPaymentDay = () => {

            eventStore.$patch((store) => {
                store.state.userEnroll.paymentDay = data.paymentDay
            });

        };

        const handleVoucherFile = (event) => {

            const file = event.target.files[0];
            const isValidImage = /\.(jpg|jpeg|png|pdf)$/i.test(file.name);

            if(isValidImage) {

                data.voucherFile = file;
                eventStore.$patch((store) => {
                    store.state.userEnroll.voucherFile = data.voucherFile
                });

                attrs.voucherFile.class = "mb-3 input-success";
                attrs.voucherFile.help = t('vaucherFile.help.success');

            } else {

                attrs.voucherFile.class = "mb-3";
                attrs.voucherFile.help = t('vaucherFile.help.allowedExtensions');

            }

        };

        const isAlphaNumeric = (value) => {
          
            eventStore.$patch((store) => {
                store.state.userEnroll.operationNumber = data.operationNumber
            });

        };

        const paymethodDetail = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: eventStore.state.editionId,
                    langId: userAccountStore.state.langId,
                    paymentMethodId: eventStore.state.userEnroll.paymentMethodId
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

        onMounted(() => {});

        return {
            alertProps,
            attrs,
            data,
            eventStore,
            getPaymentDay,
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