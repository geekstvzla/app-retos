<template>
    <div class="row wrapper-paymethods">
        <div class="col">
            <div class="additional-paymethods-data">
                <h2 class="title">Métodos de pago</h2>
                <p>Seleccione el método de pago de su preferencia para continuar con el proceso de inscripción.</p>
                <p>El pago debe ser individual, es decir, no se puede pagar por grupo o realizar un solo pago por varias personas a la vez.</p>
                <div class="price-wrapper">
                    <span class="price-title">Monto a pagar:</span>
                    <span class="price" v-if="eventStore.state.userEnroll.kitPrice !== null">
                        {{ eventStore.state.userEnroll.kitPrice }} 
                    </span>
                    <span class="badge bg-danger" v-else>
                        Debe seleccionar un kit
                    </span>
                </div>
                <form>
                    <div :class="(v$.paymentMethodId.$errors.length > 0) ? 'field-error mb-4 col-md-4 w-100' : 'mb-4 col-md-4 w-100'">
                        <select @change="paymethodDetail"
                                class="form-select"
                                :disabled="attrs.paymentMethod.disabled" 
                                id="paymethod"
                                v-model="data.paymentMethodId">
                            <option selected value="" disabled>Seleccione...</option>
                            <option :value="item.payment_method_id" v-for="(item, index) in paymethods">{{ item.payment_method }}</option>
                        </select>
                        <div class="error-msg" v-for="error of v$.paymentMethodId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                </form>
                <h4 class="subheading">Detalles del método de pago</h4>
                <div v-if="paymentMethodDetailsData.length > 0">
                    <p>Estos son los datos que necesitas para realizar el pago.</p>
                    <div v-for="(detail, index) in paymentMethodDetailsData" :key="index" class="payment-method-detail">
                        <p><strong>{{ detail.description }}:</strong> {{ detail.value }}</p>
                    </div>
                </div>
                <div v-else>
                    <p>Por favor seleccione un método de pago para ver los detalles de pago.</p>    
                </div>
            </div>  
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/PaymethodsEng.js';
import es from './langs/PaymethodsEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';

export default defineComponent({
    components: { 
        Alert
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
        const v$ = useVuelidate(rules, data, { $scope: props.scope });

        const getPaymethods = () => {
           
            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: eventStore.state.editionId,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-edition-paymethods"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                    
                    paymethods.value = rs.data; 

                    if(rs.data.length > 0) {
                        attrs.paymentMethod.disabled = false;     
                    }
                               
                };

            })
            .catch(error => {

                console.log(error);

            });

        }

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
                        eventStore.$patch((store) => {
                            store.state.userEnroll.paymentMethodId = data.paymentMethodId
                        });

                    }
                               
                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        onBeforeMount(() => {

            getPaymethods();
            
        });

        return {
            alertProps,
            attrs,
            data,
            eventStore,
            paymethods,
            paymethodDetail,
            paymentMethodDetailsData,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/Paymethods.less"></style>