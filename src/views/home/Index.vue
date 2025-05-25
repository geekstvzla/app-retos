<template>
    <div class="container" @click="hideList">
        <div class="row">
            <div class="col">
                <h1 class="title">{{ t('title') }}</h1>
                <form>
                    <div class="row g-3">
                        <div class="col-12 col-md-2 input-wrapper"
                             :class="{ 'field-error': v$.searchType.$errors.length > 0 }">
                            <select class="form-select" id="searchType" v-model="data.searchType">
                                <option disabled selected value="">{{ t('filter.searchType.label') }}</option>
                                <option value="1">Comprar</option>
                                <option value="2">Vender</option>
                                <!-- <option value="3">Transportar</option> -->
                            </select>
                        </div>
                        <div :class="productClass(v$.productId.$errors.length, listOpened)">
                            <div class="input-group">
                                <input autocomplete="off"
                                    class="form-control"
                                    id="product"
                                    @keyup="searchProduct"
                                    :placeholder="t('filter.searchProduct.label')"
                                    type="text"
                                    v-model="data.product">
                                <span class="input-group-text">
                                    <i class="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            <div class="wrapper-products-list" v-if="listOpened > 0">
                                <ul>
                                    <li @click="productSelected(product.product_id, product.product_name)" v-for="(product, index) in productsList">{{ product.product_name }}</li>
                                </ul>
                            </div>
                            <div class="error-msg" v-for="error of v$.productId.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 input-wrapper"
                             :class="{'field-error': v$.address.$errors.length > 0}">
                            <div aria-controls="offcanvasMap" 
                                 class="input-group"
                                 data-bs-target="#offcanvasMap"
                                 data-bs-toggle="offcanvas">
                                <input autocomplete="off"
                                       class="form-control"
                                       :placeholder="t('filter.searchAddress.label')"
                                       type="text"
                                       v-model="data.address.text">
                                <span class="fs-4 input-group-text open-map">
                                    <i class="bi bi-geo-alt"></i>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 col-md-2">
                            <button class="btn"
                                    @click="search"
                                    type="button"
                                    v-html="attrs.searchButton.html"></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="row wrapper-orders">
            <div class="col" v-if="orders.length === 0">
                <Alert :options="alertProps"/>
            </div>
            <OrderCard :data="order" v-for="(order, index) in orders" @openLocation="openOrderLocation"/>
        </div>
    </div>
    <Map @addressSelected="addressSelected"/>
    <SeeOrderLocation />

</template>
<script>

import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './locales/Eng';
import es from './locales/Esp';
import { ajax } from '../../utils/AjaxRequest';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Alert from '../../components/Alert.vue'
import Map from './Map.vue';
import OrderCard from './CardOrder.vue';
import SeeOrderLocation from './SeeOrderLocation.vue';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    components: {
        Alert,
        OrderCard,
        Map,
        SeeOrderLocation
    },
    setup() {
       
        onMounted(() => {

            if(orders.value.length === 0) {
                
                let alertData = {
                    message: "Usa el filtro para mostrar las ordenes",
                    show: true,
                    type: "warning"
                }
                Object.assign(alertProps, alertData);

            };

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
        const listOpened = ref(0);
        const orders = ref([]);
        const productIdSelected = ref(null);
        const productsList = ref();
        
        const attrs = reactive({
            address: {
                disabled: true
            },
            product: {
                disabled: true
            },
            searchButton:{
                disabled: true,
                html: t('filter.searchButton'),
                initHtml: t('filter.searchButton'),
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+t('filter.searchButtonLoading')+'</span>'
            }
        });

        const data = reactive({
            address: {
                latLng: "",
                text: ""
            },
            distance: "",
            productId: "",
            searchType: ""
        });

        const rules = {
            address: {
                latLng: { required: helpers.withMessage(t('validator.required'), required) }
            },
            searchType: { required: helpers.withMessage(t('validator.required'), required) },
            productId: { required: helpers.withMessage(t('validator.required'), required) }
        };

        const v$ = useVuelidate(rules, data, { $scope: false });

        const addressSelected = (location) => {
            
            data.address.latLng = location.addressLatLng;
            data.address.text = location.address;

        };

        const hideList = () => {
         
            if (listOpened.value) {
                listOpened.value = 0;
            };
            
        };

        const openOrderLocation = () => {
            console.log("abir")
        }

        const productClass = (error, listOpened) => {
            
            let index = (error + listOpened);
            let className = {
                0: "input-wrapper col-12 col-md-4",
                1: "field-error input-wrapper col-12 col-md-4",
                2: "input-wrapper list-opened col-12 col-md-4",
                3: "field-error input-wrapper list-opened col-12 col-md-4"
            };

            return className[index];
           
        };

        const productSelected = (productId, productName) => {

            data.product = productName;
            data.productId = productId;
            listOpened.value = 0;
            productIdSelected.value = productId;

        };

        const search = async function() {

            let isFormCorrect = await this.v$.$validate();
            if(isFormCorrect) {

                let ajaxData = {
                    method: "get",
                    params: {
                        distance: data.distance,
                        langId: userAccountStore.state.langId,
                        latitude: data.address.latLng.lat,
                        longitude: data.address.latLng.lng,
                        productId: parseInt(data.productId),
                        searchTypeId: data.searchType
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/orders/search-orders"
                };

                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200 && response.data.response) {
                        orders.value = response.data.response.orders;
                    };

                })
                .catch(error => {

                    console.log(error);

                });              

            };

        };

        const searchProduct = () => {

            productIdSelected.value = null;
            data.productId = null;

            if(data.product.trim().length > 3) {

                let ajaxData = {
                    method: "get",
                    params: {
                        product: data.product.toLowerCase(),
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/products/searching-products"
                };

                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200 && response.data.response) {

                        productsList.value = response.data.response.products
                        listOpened.value = (response.data.response.products.length > 0) ? 2 : 0

                    };

                })
                .catch(error => {

                    console.log(error);
                    attrs.searchButton.disabled = false;
                    attrs.searchButton.html =  attrs.searchButton.initHtml;

                    if(error.message) {

                        /*let alertData = {
                            close: (error.close) ? error.close : false,
                            message: error.message,
                            show: true,
                            timer: (error.timer) ? error.timer : false,
                            timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                            type: (error.type) ? error.type : "error"
                        }

                        Object.assign(alertProps, alertData)*/

                    };

                }); 

            } else {

                listOpened.value = 0;

            };

        };

        return {
            alertProps,
            addressSelected,
            attrs,
            data,
            listOpened,
            hideList,
            openOrderLocation,
            orders,
            productClass,
            productsList,
            productSelected,
            search,
            searchProduct,
            t,
            v$
        }

    }
});

</script>

<style lang="less" scoped src="../../assets/less/home/Index.less"></style>
