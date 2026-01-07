<template>
    <!-- <div class="container-fluid wrapper-event-banner">
        <div class="row">
            <div class="col">
                <img :alt="eventInfo.title" class="event-banner img-fluid" :src="eventInfo.banner">
            </div>
        </div>
    </div> -->
    <div class="container wrapper-event-info">
        <div class="row">
            <div class="col">
                <h1 class="event-title">{{ eventInfo.title }}</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-4">
                <img :alt="eventInfo.title" class="featured-image img-fluid" :src="eventInfo.featuredImage">
            </div>
            <div class="col-sm-12 col-md-8">
                <TechnicalSheetData @eventInfo="setEventInfo" v-if="eventStore.state.id"/>
            </div>
            <div class="col-sm-12 col-md-6">
                <modalities @getKitPrice="getKitPrice" 
                            @getCurrentCurrencyAmount="getCurrentCurrencyAmount" 
                            @getKitId="data.kitId = $event"
                            @getModalityId="data.modalityId = $event"
                            :scope="scope"
                            v-if="eventStore.state.id" />
            </div>
            <div class="col-sm-12 col-md-6">
                <PersonalData :scope="scope" />
            </div>
            <div class="col-sm-12 col-md-6">
                <!-- <AdditionalAccessories v-if="eventInfo.hasAdditionalAccessories && eventStore.state.id"/> -->
                <Paymethods @selectedPaymentMethod="data.paymentMethodId = $event" 
                            :price="kitPrice"
                            :scope="scope"
                            v-if="eventStore.state.id" />
            </div>         
            <div class="col-sm-12 col-md-6">
                <ReportPayment @getOperationNumber="data.operationNumber = $event"
                               @getPaymentDay="data.paymentDay = $event"
                               @getVoucherFile="data.voucherFile = $event"
                               :paymentmethodId="data.paymentMethodId" 
                               :scope="scope" 
                               v-if="eventStore.state.id" />
                <div class="d-grid gap-2 wrapper-renrollment-button">
                    <button class="btn btn-primary" @click="confirmEnrollment" type="button">Inscribirme</button>
                    <Alert @iAgree="iAgree" :options="alertProps" />
                </div>
            </div>   
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { ajax } from '../../../utils/AjaxRequest';
import { useI18n } from 'vue-i18n';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import { useRoute } from 'vue-router';
import AdditionalAccessories from './AdditionalAccessories.vue';
import Alert from '../../../components/Alert.vue';
import Modalities from './Modalities.vue';
import Paymethods from './Paymethods.vue';
import PersonalData from './PersonalData/Index.vue';
import ReportPayment from './ReportPayment.vue';
import TechnicalSheetData from './TechnicalSheetData.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

export default defineComponent({
    components: {
        Alert,
        AdditionalAccessories,
        Modalities,
        Paymethods,
        PersonalData,
        ReportPayment,
        TechnicalSheetData
    },
    setup() {

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const data = reactive({
            kitId: null,
            modalityId: null,
            operationNumber: null,
            paymentDay: null,
            paymentMethodId: null,
            voucherFile: null
        })
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const eventInfo = reactive({
            banner: "",
            featuredImage: "",
            hasAdditionalAccessories: 0,
            title: ""
        });
        const kitPrice = ref(null);
        const paymentmethodId = ref(null);
        const route = useRoute();
        const scope = 'eventEnrollment';
        const v$ = useVuelidate({}, {}, { $scope: true });

        const confirmEnrollment = async function() {
       
            alertProps.show = false;
            let isFormCorrect = await this.v$.$validate();
      
            if(isFormCorrect) {
                
                let alertData = {
                    iAgreeButton: {
                        show: true,
                        text: 'Si'
                    },
                    message: "¿Estás seguro de que quieres inscribirte?",
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

        const getEventDataStorage = () => {

            let ajaxData = {
                method: "get",
                params: {
                    langId: userAccountStore.state.langId,
                    slug: route.params.url
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-data-for-storage"
            };
            
            ajax(ajaxData)
            .then(function (rs) {
            
                if(rs.status === 200 && rs.data.event) {
                    
                    localStorage.setItem("eventId", rs.data.event.event_id);
                    localStorage.setItem("eventEditionId", rs.data.event.event_edition_id);

                    eventStore.$patch((store) => {
                        store.state.editionId = rs.data.event.event_id;
                        store.state.id = rs.data.event.event_edition_id;
                    });
                   
                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const getCurrentCurrencyAmount = (amount) => {
            kitPrice.value = amount;
        };

        const getKitPrice = (amount) => {
            kitPrice.value = amount;
        };

        const iAgree = () => {

            alertProps.show = false;
            
            let ajaxData = {
                method: "post",
                params: {
                    langId: userAccountStore.state.langId,
                    kitId: data.kitId,
                    modalityId: data.modalityId,
                    operationNumber: data.operationNumber,
                    paymentDay: data.paymentDay,
                    paymentMethodId: data.paymentMethodId,
                    userId: userAccountStore.state.id,
                    voucherFile: data.voucherFile
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/user-enroll"
            };

            console.log(ajaxData);
            
        };

        const setEventInfo = (data) => {
            eventInfo.banner = data.banner;
            eventInfo.featuredImage = data.featuredImage;
            eventInfo.hasAdditionalAccessories = data.hasAccessories;
            eventInfo.title = data.title;
        };

        onBeforeMount(() => {
            localStorage.clear();
            console.log("----------------")
            console.log(eventStore.state.id)
            console.log("----------------")
            if(typeof eventStore.state.id === "undefined" || eventStore.state.id === null) {

                console.log("PASOOO");
                getEventDataStorage();

            }
            
        });

        return {
            alertProps,
            confirmEnrollment,
            data,
            eventInfo,
            eventStore,
            getCurrentCurrencyAmount,
            getKitPrice,
            iAgree,
            kitPrice,
            paymentmethodId,
            setEventInfo,
            scope,
            t,
            userAccountStore,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/EventDetail.less"></style>