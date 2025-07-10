<template>
    <div class="row wrapper-technical-sheet">
        <div class="col">
            <div class="technical-sheet-data">
                <h2 class="title">Ficha Técnica</h2>
                <p><strong class="subtitle">Fecha:</strong> {{ eventInfo.departureDate }}</p>
                <p><strong class="subtitle">Cierre de inscripciones:</strong> {{ eventInfo.enrollmentEndtDate }}</p>
                <p><strong class="subtitle">Lugar de salida:</strong> {{ eventInfo.departurePlaceName }}</p>
                <p><strong class="subtitle">Lugar de llegada:</strong> {{ eventInfo.arrivalPlaceName }}</p>
                <p><strong class="subtitle">Modalidad(es):</strong> <span class="badge rounded-pill text-bg-primary" v-for="(data, index) in eventInfo.modes">{{ data.mode }}</span></p>
                <p><strong class="subtitle">Distancia(s):</strong> <span class="distance">{{ eventInfo.distances }}</span></p>
                <p><strong class="subtitle">Costo:</strong></p>
                <p><strong class="subtitle">¿Qué incluye?:</strong> <span class="distance">{{ eventInfo.includes }}</span></p>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default defineComponent({
    emits: ["eventInfo"],
    props: {},
    setup(props, { emit }) {

        const eventInfo = reactive({
            arrivalPlaceName: "",
            banner: "",
            departureDate: "",
            departurePlaceName: "",
            distances: "",
            enrollmentEndtDate: "",
            featuredImage: "",
            includes: "",
            modes: "",
            title: ""
        });

         const messages = {
            en: en,
            es: es
        };

        const { t } = useI18n({
            messages
        });

        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();

        const dateFormat = (dateString) => {

            var format = "";
            var locale = "";

            if(userAccountStore.state.langId === "esp") {
                format = "DD MMMM YYYY hh:mm a";
                locale = "es";
            } else {
                format = "MMMM D, YYYY";
                locale = "en";
            }

            return dayjs(dateString).locale(locale).format(format);

        };

        const getEventDetail = () => {

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
                    eventInfo.enrollmentEndtDate = dateFormat(rs.data.response.enrollment_end_date);
                    eventInfo.featuredImage = rs.data.response.featured_image;
                    eventInfo.includes = rs.data.response.event_includes;
                    eventInfo.modes = rs.data.response.event_modes;
                    eventInfo.title = rs.data.response.title;

                    emit("eventInfo", eventInfo);

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        onBeforeMount(() => {
            getEventDetail();
        });

        return {
            eventInfo
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/TechnicalSheetData.less"></style>