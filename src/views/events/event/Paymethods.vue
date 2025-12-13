<template>
    <div class="row wrapper-additional-accessories">
        <div class="col">
            <div class="additional-accessories-data">
                <h2 class="title">Métodos de pago</h2>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div :class=" (v$.paymentMethodId.$errors.length > 0) ? 'field-error mb-4 col-md-4' : 'mb-4 col-md-4'">
                            <select @change="paymethodDetail"
                                    class="form-select"
                                    :disabled="attrs.paymentMethod.disabled" 
                                    id="paymethod"
                                    v-model="data.paymentMethodId">
                                <option selected value="">Seleccione...</option>
                                <option :value="item.payment_method_id" v-for="(item, index) in paymethods">{{ item.payment_method }}</option>
                            </select>
                            <div class="error-msg" v-for="error of v$.paymentMethodId.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
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
import { helpers, numeric, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';

export default defineComponent({
    components: { 
        Alert
    },
    setup() {

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
        const { t } = useI18n({
            messages
        });  
        
        const eventStore = useEventStore();
        const rules = {
            paymentMethodId: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: false });

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
                    
                    console
                    //paymethods.value = rs.data; 

                    /*if(rs.data.length > 0) {
                        attrs.paymentMethod.disabled = false;     
                    }*/
                               
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
            paymethods,
            paymethodDetail,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/AdditionalAccessories.less"></style>