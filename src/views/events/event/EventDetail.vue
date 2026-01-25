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
                <modalities :scope="scope" v-if="eventStore.state.id" />
            </div>
            <div class="col-sm-12 col-md-6">
                <PersonalData :scope="scope" />
            </div>
            <div class="col-sm-12 col-md-6">
                <!-- <AdditionalAccessories v-if="eventInfo.hasAdditionalAccessories && eventStore.state.id"/> -->
                <Paymethods :scope="scope" v-if="eventStore.state.id" />
            </div>         
            <div class="col-sm-12 col-md-6">
                <ReportPayment :scope="scope" v-if="eventStore.state.id" />
                <div class="d-grid gap-2 wrapper-renrollment-button">
                    <button class="btn btn-primary" 
                            @click="confirmEnrollment"
                            :disabled="btnEnroll.disabled"
                            type="button"
                            v-html="btnEnroll.html"></button>
                    <Alert @iAgree="iAgree" :options="alertProps" ref="enrollAlert" />
                </div>
            </div>   
        </div>
    </div>
</template>

<script>

import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useScroll, useWindowScroll } from '@vueuse/core';
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
        const btnEnroll = reactive({
            disabled: false,
            html: t('enrollBtn.defaultText'),
            loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> '+ t('enrollBtn.loading') +'</span>'
        });
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const enrollAlert = ref(null);
        const eventInfo = reactive({
            banner: "",
            featuredImage: "",
            hasAdditionalAccessories: 0,
            title: ""
        });
        const moveToEle = ref(null); 
        const route = useRoute();
        const scope = 'eventEnrollment';
        const v$ = useVuelidate({}, {}, { $scope: true });
        const { x, y } = useWindowScroll(moveToEle);

        const confirmEnrollment = async function() {
       
            alertProps.show = false;
            let isFormCorrect = await this.v$.$validate();
     
            if(isFormCorrect) {
                
                let alertData = {
                    iAgreeButton: {
                        show: true,
                        text: 'Si'
                    },
                    message: t('confirmEnroll', {name: userAccountStore.state.name}),
                    noAgreeButton: {
                        show: true,
                        text: 'No'
                    },
                    show: true,
                    timer: false,
                    timerSeconds: 0,
                    type: "confirm"
                };
                Object.assign(alertProps, alertData);  
                
                /*await nextTick();
                moveToEle.value = enrollAlert.value.$el;
                scrollToTarget();*/

            } else {

                //console.log(this.v$.$errors)
                /*for(var i = 0; i < this.v$.$errors.length; i++) {
                    console.log(this.v$.$errors[i])
                }*/
                

                let alertData = {
                    iAgreeButton: {
                        show: false,
                        text: ''
                    },
                    message: t('formInvalid'),
                    noAgreeButton: {
                        show: false,
                        text: ''
                    },
                    show: true,
                    timer: false,
                    timerSeconds: 0,
                    type: "error"
                };
                Object.assign(alertProps, alertData);

            }

            await nextTick();
            moveToEle.value = enrollAlert.value.$el;
            scrollToTarget();

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

        const iAgree = () => {

            alertProps.show = false;
            btnEnroll.disabled = true;
            btnEnroll.html = btnEnroll.loadingHtml;
            let attrs = JSON.stringify(toRaw(eventStore.state.userEnroll.kitAttrs));
            
            let userName = (userAccountStore.state.name === null) ? userAccountStore.state.username : userAccountStore.state.name;
            
            const formData = new FormData();
            formData.append('editionId', eventStore.state.editionId);
            formData.append('langId', userAccountStore.state.langId);
            formData.append('kitAttrs', attrs);
            formData.append('kitId', eventStore.state.userEnroll.kitId);
            formData.append('modalityId', eventStore.state.userEnroll.modalityId);
            formData.append('operationNumber', eventStore.state.userEnroll.operationNumber);
            formData.append('paymentDay', eventStore.state.userEnroll.paymentDay);
            formData.append('paymentMethodId', eventStore.state.userEnroll.paymentMethodId);
            formData.append('userEmail', userAccountStore.state.email);
            formData.append('userId', userAccountStore.state.id);
            formData.append('userName', userName);
            formData.append('voucherFile', eventStore.state.userEnroll.voucherFile);
          
            let ajaxData = {
                method: "post",
                formData: formData,
                url: import.meta.env.VITE_API_BASE_URL+"/events/user-enroll"
            };
       
            ajax(ajaxData)
            .then(function (rs) {
                 console.log(rs.data);
                if(rs.status === 200 && rs.data) {
                    
                    let alertData = {
                        iAgreeButton: {
                            show: false,
                            text: 'Yes'
                        },
                        iconCloseButton: false,
                        message: rs.data.response.message,
                        noAgreeButton: {
                            show: false,
                            text: 'Close'
                        },
                        show: true,
                        timer: false,
                        timerSeconds: 0,
                        type: rs.data.response.status
                    };

                    if(rs.data.response.status === "success") {

                        //router.push({ name: "home" });


                    } else {

                       /* btnEnroll.disabled = false;
                        btnEnroll.html = t('enrollBtn.defaultText');*/

                        
                        
                    }

                     btnEnroll.disabled = false;
                     btnEnroll.html = t('enrollBtn.defaultText');

                    Object.assign(alertProps, alertData);  
                       
                };

            })
            .catch(error => {

                btnEnroll.disabled =  false;
                btnEnroll.html = t('enrollBtn.defaultText');
                console.log(error);

            });
            
        };

        const scrollToTarget = async () => {

            await nextTick();

            if (moveToEle.value) {
                console.log("PASO")
                console.log("---------------------")
                console.log(moveToEle.value)
                console.log("---------------------")
                x.value = moveToEle.value.offsetLeft;
                y.value = moveToEle.value.offsetTop;

            }

        };

        const setEventInfo = (data) => {
            eventInfo.banner = data.banner;
            eventInfo.featuredImage = data.featuredImage;
            eventInfo.hasAdditionalAccessories = data.hasAccessories;
            eventInfo.title = data.title;
        };

        onBeforeMount(() => {
            
            if(typeof eventStore.state.id === "undefined" || eventStore.state.id === null) {
      
                getEventDataStorage();

            }
            
        });

        onMounted(() => {

        });

        watch(
            () => eventStore.$state,
            (newState, oldState) => {
                //Ocultamos el alert de inscripción porque se detecto que
                //algún dato del store ha cambiado y se necesita re-evaluar
                alertProps.show = false;
            },
            { deep: true } // Use deep watch for nested changes
        );

        return {
            alertProps,
            btnEnroll,
            confirmEnrollment,
            enrollAlert,
            eventInfo,
            eventStore,
            iAgree,
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