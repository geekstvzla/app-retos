<template>
    <div class="row wrapper-renrollment-button">
        <div class="col">
            <div class="d-grid gap-2">
                <button class="btn btn-primary" @click="confirmEnrollment" type="button">Inscribirme</button>
                <Alert @iAgree="iAgree" @noAgree="noAgree" :options="alertProps" />
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/EnrollmentButtonEng.js';
import es from './langs/EnrollmentButtonEsp.js';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Alert from '../../../components/Alert.vue';

export default defineComponent({
    components: { 
        Alert
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
            modalityId: "",
            kitId: ""
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
            modalityId: { required: helpers.withMessage(t('validator.required'), required) },
            kitId: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();
        const v$ = useVuelidate(rules, data);

        const confirmEnrollment = async function() {
       
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

        const enrollUser = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: eventStore.state.editionId,
                    eventId: eventStore.state.id,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-detail"
            };

            ajax(ajaxData)
            .then(function (rs) {

                if(rs.status === 200 && rs.data.response) {
                    
                    eventInfo.arrivalPlaceName = rs.data.response.arrival_place_name;
                    eventInfo.banner = rs.data.response.banner_image;
                    eventInfo.departureDate = dateFormat(rs.data.response.departure_date);
                    eventInfo.departurePlaceName = rs.data.response.departure_place_name;
                    eventInfo.distances = rs.data.response.event_distances;
                    eventInfo.edition = rs.data.response.event_edition;
                    eventInfo.enrollmentEndtDate = dateFormat(rs.data.response.enrollment_end_date);
                    eventInfo.featuredImage = rs.data.response.featured_image;
                    eventInfo.hasAccessories = (rs.data.response.has_accessories > 0) ? true : false;
                    eventInfo.modes = rs.data.response.event_modes;
                    eventInfo.title = rs.data.response.title;

                    emit("eventInfo", eventInfo);

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const iAgree = () => {
            enrollUser();
        };

        const noAgree = () => {
            attrs.buyButton.disabled = false
        };


        return {
            alertProps,
            confirmEnrollment,
            iAgree,
            noAgree,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/EnrollmentButton.less"></style>