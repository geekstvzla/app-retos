<template>
    <div class="row wrapper-modalities-sheet">
        <div class="col">
            <div class="modalities-sheet-data">
                <h2 class="title">Modalidades Disponibles</h2>
                <form>
                    <div class="row mb-3">
                        <div :class="(v$.modality.$errors.length > 0) ? 'field-error col-12 col-xl-6 mb-3' : 'col-12 col-xl-6 mb-3'">
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
                        <div :class="(v$.kit.$errors.length > 0) ? 'field-error col-12 col-xl-6 mb-3' : 'col-12 col-xl-6 mb-3'">
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
                            <label for="kits" class="col-form-label" v-if="kitItems.length > 0">¿Qué incluye?</label>
                            <div class="wrapper-kit-includes" v-if="kitItems.length > 0">
                                <span :class="'badge ' + item.class" v-for="(item, index) in kitItems">{{ item.desc }}</span>
                            </div>
                            <div class="row mb-3 wrapper-customize-your-kit-title" v-if="kitItemsAttrs.length > 0">
                                <h2 class="title">Personaliza tu kit</h2>
                                <div :class="(v$.customizeYourKit.$each.$message[indexItem].length > 0) ? 'field-error col-12 col-sm-6 mb-3' : 'col-12 col-sm-6 mb-3'"
                                     :key="indexItem"
                                     v-for="(item, indexItem) in kitItemsAttrs">
                                    <label for="kits" class="col-form-label">{{ item.attr }}</label>
                                    <select @change="kitAttrs"
                                            class="form-select"
                                            v-model="data.customizeYourKit[indexItem].val">
                                        <option disabled selected value="">Seleccione...</option>
                                        <option v-for="(attr, index2) in item.attrValues" 
                                                :value="attr">{{ attr.description }}</option>
                                    </select>
                                    <div class="error-msg" v-for="error of v$.customizeYourKit.$each.$message[indexItem]">
                                        <p>{{ error }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>  
            </div>  
        </div>
    </div>
</template>

<script>

import { defineComponent, nextTick, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/ModalitiesEng.js';
import es from './langs/ModalitiesEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    components: { 
        Alert
    },
    setup(props) {

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
            customizeYourKit: [
                {"val": ""},
                {"val": ""}
            ],
            kit: "",
            modality: ""
        });
        const kits = ref([]);
        const kitItemsDefault = {desc: "Seleccione el kit para mostrar lo que incluye.", class: "text-bg-warning"};
        const kitItems = ref([kitItemsDefault]);
        const kitItemsAttrs = ref([]);
        const kitPrice = ref(null);
        const messages = {
            en: en,
            es: es
        };
        const modalities = ref([]);
        const { t } = useI18n({
            messages
        });  

        const rules = {    
            customizeYourKit: { 
                $each: helpers.forEach({
                    val: {requiredIf: helpers.withMessage(t('validator.required'), requiredIf(() => {
                        return (kitItemsAttrs.value.length > 0);
                    }))}
                })
            },
            modality: { required: helpers.withMessage(t('validator.required'), required) },
            kit: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data, { $scope: props.scope });

        const changingCurrency = () => {
          
            kitPrice.value = currentCurrency.value;
            eventStore.$patch((store) => {
                store.state.userEnroll.kitPrice = currentCurrency.value
            });

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
                    eventStore.$patch((store) => {
                        store.state.userEnroll.kitId = data.kit
                    });

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

                if(rs.status === 200 && rs.data) {
                    
                    kitItems.value = [];
                    kitItemsAttrs.value = [];
                   
                    rs.data.forEach(function(element, index) {

                        kitItems.value.push({"desc":element.item, "class": "text-bg-primary"});

                        element.attrs.forEach(function(attr, index2) {
                            kitItemsAttrs.value.push(attr);
                        });

                    });
                
                    getKitItemsExchange();
                    kitPrice.value = kits.value.find(kit => kit.kitId === data.kit).priceFormatted;
                    currentCurrency.value = kits.value.find(kit => kit.kitId === data.kit).priceFormatted;

                    eventStore.$patch((store) => {
                        store.state.userEnroll.kitPrice = kits.value.find(kit => kit.kitId === data.kit).priceFormatted
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

                        eventStore.$patch((store) => {
                            store.state.userEnroll.modalityId = data.modality
                            store.state.userEnroll.modalityTitle = modalities.value[0].modality;
                        });

                    } else {

                        // kitItems.value = [kitItemsDefault];

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
                    eventEditionId: eventStore.state.editionId,
                    langId: userAccountStore.state.langId,
                    typeEventModeId: data.modality
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-modality-kits"
            };

            ajax(ajaxData)
            .then(async function (rs) {
                
                if(rs.status === 200 && rs.data) {
                    
                    kits.value = rs.data;
                    attrs.kits.disabled = false;
                    eventStore.$patch((store) => {
                        store.state.userEnroll.modalityId = data.modality
                    });

                    await nextTick();

                    if(rs.data.length === 1) {
                       
                        data.kit = rs.data[0].kitId;
                        getKitItems();

                    }

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const kitAttrs = () => {

            data.customizeYourKit.forEach(function(custom) {

                if(custom.val !== "") {
                    
                    if(eventStore.state.userEnroll.kitAttrs.some(attr => attr.attrId === custom.val.attrId)) {

                        var foundIndex = eventStore.state.userEnroll.kitAttrs.findIndex(e => e.attrId == custom.val.attrId);
                     
                        eventStore.$patch((store) => {
                            store.state.userEnroll.kitAttrs[foundIndex] = custom.val;
                        });

                    } else {

                        eventStore.$patch((store) => {
                            store.state.userEnroll.kitAttrs.push(custom.val);
                        });

                    }

                }

            });

        }

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
            getModalityKits,
            kits,
            kitAttrs,
            kitItems,
            kitItemsAttrs,
            kitPrice,
            modalities,
            t,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/Modalities.less"></style>