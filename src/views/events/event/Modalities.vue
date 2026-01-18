<template>
    <div class="row wrapper-modalities-sheet">
        <div class="col">
            <div class="modalities-sheet-data">
                <h2 class="title">Modalidades Disponibles</h2>
                <form>
                    <div class="row mb-3">
                        <div :class="(v$.modality.$errors.length > 0) ? 'field-error col-6 mb-3' : 'col-6 mb-3'">
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
                            <div class="error-msg" v-for="error of v$.modality.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class="(v$.kit.$errors.length > 0) ? 'field-error col-6 mb-3' : 'col-6 mb-3'">
                            <label for="kits" class="col-form-label">Kit</label>
                            <select @change="getKitItems(); getKitIteamsAttrs();"
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
                            <div class="error-msg" v-for="error of v$.kit.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="price-wrapper">
                                <span class="price-title">Precio:</span>
                                <span class="price" v-if="data.kit && kits.length > 0">
                                    {{ kitPrice }} 
                                </span>
                                <span class="badge bg-danger" v-else>
                                    Debe seleccionar un kit
                                </span>
                                    <select @change="changingCurrency"
                                            class="form-select form-select-sm d-inline-block w-auto ms-3"
                                            v-if="data.kit && kits.length > 0"
                                            v-model="currentCurrency">
                                        <option :value="item.priceFormatted"
                                                v-for="(item, index) in currencyExchange">Precio en {{ item.currencyDesc }}</option>
                                    </select>
                            </div>
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

import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/ModalitiesEng.js';
import es from './langs/ModalitiesEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    emits: ["getCurrentCurrencyAmount", "getKitId", "getKitPrice", "getModalityId"],
    components: { 
        Alert
    },
    setup(props, { emit }) {

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
        const currencyExchange = ref([]);
        const currentCurrency = ref(null);
        const data = reactive({
            kit: "",
            modality: ""
        });
        const kits = ref([]);
        const kitItemsDefault = {desc: "Seleccione el kit para mostrar lo que incluye.", class: "text-bg-warning"};
        const kitItems = ref([kitItemsDefault]);
        const kitPrice = ref(null);
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
            modality: { required: helpers.withMessage(t('validator.required'), required) },
            kit: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: props.scope });

        const changingCurrency = () => {
 
            kitPrice.value = currentCurrency.value;
            emit("getCurrentCurrencyAmount", currentCurrency.value);

        };

        const getKitItemsExchange = () => {

            let ajaxData = {
                method: "get",
                params: {
                    kitId: data.kit,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/kit-items-exchange"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                    
                    currencyExchange.value = rs.data;
                    emit("getKitId", data.kit);

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

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
                console.log(rs.data)
                if(rs.status === 200 && rs.data) {
                    
                    kitItems.value = [];

                    rs.data.forEach(function(element, index) {
                        kitItems.value.push({"desc":element.item, "class": "text-bg-primary"});
                    });
                    
                    getKitItemsExchange();
                    kitPrice.value = kits.value.find(kit => kit.kitId === data.kit).priceFormatted;
                    currentCurrency.value = kits.value.find(kit => kit.kitId === data.kit).priceFormatted;

                    emit("getKitPrice", kits.value.find(kit => kit.kitId === data.kit).priceFormatted);

                };

            })
            .catch(error => {

                console.log(error);

            });

        }

        const getKitIteamsAttrs = () => {
            return
            let ajaxData = {
                method: "get",
                params: {
                    kitId: data.kit,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/kit-items-attrs"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                    
                    kitItems.value = [];

                    rs.data.forEach(function(element, index) {
                        kitItems.value.push({"desc":element.item, "class": "text-bg-primary"});
                    });
                    
                    getKitItemsExchange();
                    kitPrice.value = kits.value.find(kit => kit.kitId === data.kit).priceFormatted;
                    currentCurrency.value = kits.value.find(kit => kit.kitId === data.kit).priceFormatted;

                    emit("getKitPrice", kits.value.find(kit => kit.kitId === data.kit).priceFormatted);

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
                        emit("getModalityId", data.modality);

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
                    attrs.kits.disabled = false;
                    emit("getModalityId", data.modality);

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        onBeforeMount(() => {

            getModalities();
            //getCountriesPhoneCodes();
            
        });

        return {
            alertProps,
            attrs,
            changingCurrency,
            currencyExchange,
            currentCurrency,
            data,
            getKitItems,
            getKitIteamsAttrs,
            getModalityKits,
            kits,
            kitItems,
            kitPrice,
            modalities,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/Modalities.less"></style>