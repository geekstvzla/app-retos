<template>
    <div class="container" @click="hideList">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <h3 class="title">{{ t('title') }}</h3>
                <form>
                    <div :class="productClass(v$.productId.$errors.length, listOpened)">
                        <div class="input-group">
                            <div class="form-floating">
                                <input autocomplete="off"
                                       class="form-control"
                                       :disabled="attrs.product.disabled"
                                       id="product"
                                       @keyup="searchProduct"
                                       placeholder="Product"
                                       type="text"
                                       v-model="data.product">
                                <label class="form-label">{{ t('searchProduct.label') }}</label>
                            </div>
                            <span class="input-group-text">
                                <i class="bi bi-search"></i>
                            </span>
                        </div>
                        <div class="wrapper-products-list" v-if="listOpened > 0">
                            <ul>
                                <li @click="productSelected(product.product_id, product.product_name)" v-for="(product, index) in productsList">{{ product.product_name }}</li>
                            </ul>
                        </div>
                        <div id="productHelpBlock" class="form-text">
                            {{ t('searchProduct.help') }}
                        </div>
                        <div class="error-msg" v-for="error of v$.productId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.amount.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <input class="form-control"
                                       :disabled="attrs.amount.disabled"
                                       placeholder="Amount"
                                       type="text"
                                       v-maska="amountMaskOpt"
                                       v-model="data.amount">
                                <label>{{ t('amount.label') }}</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.amount.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class="(v$.weighingUnit.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <select class="form-select" :disabled="attrs.weighingUnit.disabled" id="weighingUnits" v-model="data.weighingUnit">
                                    <option disabled selected value="">{{ t('weighingUnit.select') }}</option>
                                    <option v-for="(unit, index) in weighingUnitsList" 
                                            :value="unit.weighing_unit_id">{{ unit.abbreviation }}</option>
                                </select>
                                <label for="floatingSelectGrid">{{ t('weighingUnit.label') }}</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.amount.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.price.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <input class="form-control"
                                       :disabled="attrs.price.disabled"
                                       id="price"
                                       placeholder="Price"
                                       type="text"
                                       v-maska="priceMaskOpt"
                                       v-model="data.price">
                                <label>{{ t('price.label') }}</label>
                            </div>
                            <div id="priceHelpBlock" class="form-text">
                                {{ t('price.example') }}
                            </div>
                            <div class="error-msg" v-for="error of v$.price.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class="(v$.currency.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <select class="form-select" :disabled="attrs.currency.disabled" id="currencies" v-model="data.currency">
                                    <option disabled selected value="">Seleccione</option>
                                    <option v-for="(currency, index) in currenciesList" 
                                            :value="currency.currency_id">{{ currency.currency_desc }}</option>
                                </select>
                                <label for="floatingSelectGrid">{{ t('currency.label') }}</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.currency.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <Map @addressSelected="addressSelected" :latLng="data.addressLatLng"/>
                    <div class="row g-2 mb-3">
                        <div class="col">
                            <div class="alert alert-info mb-0" role="alert" v-html="t('note')"></div>
                        </div>
                    </div>
                    <div class="d-grid">
                        <button :disabled="attrs.buyButton.disabled"
                                @click="confirmSale"
                                class="btn btn-filled"
                                id="btn-buy"
                                type="button"
                                v-html="attrs.buyButton.html"></button>
                        <Alert @iAgree="iAgree" @noAgree="noAgree" :options="alertProps" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './locales/BuyEng';
import es from './locales/BuyEsp';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Alert from '../../components/Alert.vue';
import { useEncryptionStore } from '../../stores/encryption.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';
import { ajax } from '../../utils/AjaxRequest';
import { vMaska } from 'maska/vue';
import Map from './Map.vue';

export default defineComponent({
    directives: { 
        maska: vMaska 
    },
    components: {
        Alert,
        Map
    },
    setup() {

        onBeforeMount(() => {
            currencies();
        })

        onMounted(() => {

            attrs.buyButton.disabled = false;
            attrs.product.disabled = false;

        })
        
        onBeforeRouteLeave((to, from, next) => {
            alertProps.show = false;
            next();
        });

        const userAccountStore = useUserAccountStore();
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const amountMaskOpt = reactive({
            eager: true,
            mask: "#,##",
            number: {
                fraction: 2,
                locale: 'de',
                unsigned: true           
            },
            reversed: true           
        });
        const currenciesList = ref();
        const encryptionStore = useEncryptionStore();
        const listOpened = ref(0);
        const priceMaskOpt = reactive({
            eager: true,
            mask: "#,##",
            number: {
                fraction: 2,
                locale: 'de',
                unsigned: true           
            },
            reversed: true           
        });
        const productIdSelected = ref(null);
        const productsList = ref();
        const route = useRoute();
    
        const weighingUnitsList = ref([])

        const data = reactive({
            addressLatLng: {},
            amount: "",
            confirmed: 0,
            currency: "",
            price: null,
            product: "",
            productId: null,
            weighingUnit: ""
        })
        
        const attrs = reactive({
            amount: {
                disabled: true,
                format: {
                    decimal: ',',
                    separator: '.',
                    precision: 2,
                    masked: false,
                    min: "0,00",
                    nullValue: "0,00"
                }
            },
            currency: {
                disabled: true
            },
            price: {
                disabled: true
            },
            product: {
                disabled: true
            },
            buyButton:{
                disabled: true,
                html: t('buyButton.initText'),
                initHtml: t('buyButton.initText'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('buyButton.loadingText') +'</span>'
            },
            weighingUnit: {
                disabled: true
            }
        });
        
        const rules = {
            productId: { required: helpers.withMessage(t('validator.required'), required) },
            amount: { required: helpers.withMessage(t('validator.required'), required) },
            weighingUnit: { required: helpers.withMessage(t('validator.required'), required) },
            price: { required: helpers.withMessage(t('validator.required'), required) },
            currency: { required: helpers.withMessage(t('validator.required'), required) }
        };

        const v$ = useVuelidate(rules, data);

        const addressSelected = (latLng) => {

            data.addressLatLng = latLng;

        };

        const confirmSale = async function() {
       
            alertProps.show = false;
            data.confirmed = 0;

            let isFormCorrect = await this.v$.$validate();
            if(isFormCorrect) {
                
                attrs.buyButton.disabled = true;
                let alertData = {
                    iAgreeButton: {
                        show: true,
                        text: 'Si'
                    },
                    message: "¿Estás seguro de realizar esta acción?",
                    noAgreeButton: {
                        show: true,
                        text: 'No'
                    },
                    show: true,
                    timer: false,
                    timerSeconds: 0,
                    type: "confirm"
                }
                Object.assign(alertProps, alertData)                

            }

        }

        const currencies = () => {
           
            let ajaxData = {
                method: "get",
                url: import.meta.env.VITE_API_BASE_URL+"/general/active-currencies"
            };

            ajax(ajaxData)
            .then(function (response) {
                
                if(response.status === 200 && response.data.response) {

                    currenciesList.value = response.data.response.currencies

                };

            })
            .catch(error => {

                attrs.buyButton.disabled = false
                attrs.buyButton.html =  attrs.buyButton.initHtml

                if(error.message) {

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }

                    Object.assign(alertProps, alertData)

                }

            });

        };

        const hideList = () => {
         
            if (listOpened.value) {
                listOpened.value = 0;
            };
            
        };

        const iAgree = () => {

            alertProps.show = false;
            attrs.buyButton.html = attrs.buyButton.loadingHtml;

            let ajaxData = {
                method: "post",
                params: {
                    amount: stringToNumber(data.amount),
                    confirmed: parseInt(data.confirmed),
                    currencyId: parseInt(data.currency),
                    langId: 1,
                    latitude: data.addressLatLng.lat,
                    longitude: data.addressLatLng.lng,
                    orderTypeId: 1,
                    price: stringToNumber(data.price),
                    productId: parseInt(data.productId),
                    userId: 1,
                    weighingUnitId: parseInt(data.weighingUnit)
                },
                url: import.meta.env.VITE_API_BASE_URL+"/orders/create-order"
            };

            ajax(ajaxData)
            .then(function (response) {

                console.log(response.data.response)
                
                attrs.buyButton.html = attrs.buyButton.initHtml
                attrs.buyButton.disabled = false

                if(response.status === 200 && response.data.response) {

                    if(response.data.response.statusCode === 1) {

                        data.addressLatLng = {}
                        data.amount = ""
                        data.confirmed = 0
                        data.currency = ""
                        data.price = null
                        data.product = "",
                        data.productId = null,
                        data.weighingUnit = ""
                        document.getElementById("address").value = ''

                        v$.value.$reset()

                        var alertData = {
                            message: response.data.response.message,
                            show: true,
                            timer: true,
                            timerSeconds: 5,
                            type: "success"
                        }

                    } else if(response.data.response.statusCode === 4) {

                        data.confirmed = 1
                        var alertData = {
                            iAgreeButton: {
                                show: true,
                                text: 'Si'
                            },
                            message: response.data.response.message,
                            noAgreeButton: {
                                show: true,
                                text: 'No'
                            },
                            show: true,
                            timer: false,
                            timerSeconds: 0,
                            type: "confirm"
                        }   

                    } else {

                        attrs.buyButton.disabled = false
                        console.log("ERROR LOGIN CODIGO NO DEFINIDO")
                        /*throw {
                            message: t('signIn.alert.error'),
                            type: "error"
                        }*/

                    }

                    Object.assign(alertProps, alertData)

                } else {

                    console.log("ERROR LOGIN")
                    /*throw {
                        message: t('signIn.alert.error'),
                        type: "error"
                    }*/

                }

            })
            .catch(error => {

                attrs.buyButton.disabled = false
                console.log(error)

            })

        }

        const productClass = (error, listOpened) => {
            
            let index = (error + listOpened)
            let className = {
                0: "mb-3 input-wrapper",
                1: "field-error mb-3 input-wrapper",
                2: "mb-3 input-wrapper list-opened",
                3: "field-error mb-3 input-wrapper list-opened"
            };

            return className[index];
           
        };

        const noAgree = () => {
            attrs.buyButton.disabled = false
        };

        const productSelected = (productId, productName) => {

            data.product = productName;
            data.productId = productId;
            listOpened.value = 0;
            productIdSelected.value = productId;
            weighingUnits();

        };

        const searchProduct = () => {

            productIdSelected.value = null
            attrs.amount.disabled = true
            attrs.weighingUnit.disabled = true
            data.productId = null

            if(data.product.trim().length > 3) {

                let ajaxData = {
                    method: "get",
                    params: {
                        product: data.product.toLowerCase(),
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/products/searching-products"
                }

                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200 && response.data.response) {

                        attrs.amount.disabled = false
                        attrs.currency.disabled = false
                        attrs.price.disabled = false
                        attrs.weighingUnit.disabled = false

                        productsList.value = response.data.response.products
                        listOpened.value = (response.data.response.products.length > 0) ? 2 : 0

                    }

                })
                .catch(error => {

                    attrs.buyButton.disabled = false
                    attrs.buyButton.html =  attrs.buyButton.initHtml

                    if(error.message) {

                        let alertData = {
                            close: (error.close) ? error.close : false,
                            message: error.message,
                            show: true,
                            timer: (error.timer) ? error.timer : false,
                            timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                            type: (error.type) ? error.type : "error"
                        }

                        Object.assign(alertProps, alertData)

                    }

                })   

            } else {

                listOpened.value = 0

            }

        }

        const stringToNumber = (string) => {

            return parseFloat(string.replace('.','').replace(',','.')).toFixed(2)

        }

        const weighingUnits = () => {

            let ajaxData = {
                method: "get",
                params: {
                    productId: productIdSelected.value,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/products/product-weighing-units"
            }

            ajax(ajaxData)
            .then(function (response) {

                if(response.status === 200 && response.data.response) {
                    
                    if(response.data.response.weighingUnits.length === 1) {
                        data.weighingUnit = response.data.response.weighingUnits[0].weighing_unit_id
                    }

                    weighingUnitsList.value = response.data.response.weighingUnits
                
                }

            })
            .catch(error => {

                attrs.buyButton.disabled = false
                attrs.buyButton.html =  attrs.buyButton.initHtml

                if(error.message) {

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }

                    Object.assign(alertProps, alertData)

                }

            })

        }

        return {
            addressSelected,
            alertProps,
            amountMaskOpt,
            attrs,
            confirmSale,
            currenciesList,
            data,
            hideList,
            iAgree,
            listOpened,
            noAgree,
            priceMaskOpt,
            productClass,
            productsList,
            productSelected,
            searchProduct,
            t,
            v$,
            weighingUnitsList
        }

    }
})

</script>

<style lang="less" src="../../assets/less/orders/Buy.less" scoped></style>