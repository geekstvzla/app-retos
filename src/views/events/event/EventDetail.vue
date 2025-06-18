<template>
    <div class="container-fluid wrapper-event-banner">
        <div class="row">
            <div class="col">
                <img :alt="eventInfo.title" class="event-banner img-fluid" :src="eventInfo.banner">
            </div>
        </div>
    </div>
    <div class="container wrapper-event-info">
        <div class="row">
            <div class="col">
                <h1 class="event-title">{{ eventInfo.title }}</h1>
                <div class="row wrapper-technical-sheet">
                    <div class="col">
                        <div class="technical-sheet-data">
                            <h2>Ficha Técnica</h2>
                            <p><strong class="title">Fecha:</strong> {{ eventInfo.departureDate }}</p>
                            <p><strong class="title">Lugar de salida:</strong> {{ eventInfo.departurePlaceName }}</p>
                            <p><strong class="title">Lugar de llegada:</strong> {{ eventInfo.arrivalPlaceName }}</p>
                            <p><strong class="title">Modalidad(es):</strong> <span class="badge rounded-pill text-bg-primary" v-for="(data, index) in eventInfo.modes">{{ data.mode }}</span></p>
                            <p><strong class="title">Distancia(s):</strong> <span class="distance" v-for="(data, index) in eventInfo.distances">{{ data.distance }}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <img :alt="eventInfo.title" class="featured-image img-fluid" :src="eventInfo.featuredImage">
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default defineComponent({
    setup() {

        const eventInfo = reactive({
            arrivalPlaceName: "",
            banner: "",
            departureDate: "",
            departurePlaceName: "",
            distances: "",
            featuredImage: "",
            modes: "",
            title: ""
        });
        const departureDate = ref(null);
        const messages = {
            en: en,
            es: es
        };
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const { t } = useI18n({
            messages
        });

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

                console.log(rs.data)
                if(rs.status === 200 && rs.data.response) {
                    
                    eventInfo.arrivalPlaceName = rs.data.response.arrival_place_name;
                    eventInfo.banner = rs.data.response.banner_image;
                    eventInfo.departureDate = dateFormat(rs.data.response.departure_date);
                    eventInfo.departurePlaceName = rs.data.response.departure_place_name;
                    eventInfo.distances = rs.data.response.event_distances;
                    eventInfo.featuredImage = rs.data.response.featured_image;
                    eventInfo.modes = rs.data.response.event_modes;
                    eventInfo.title = rs.data.response.title;

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
            eventInfo,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/EventDetail.less"></style>