<template>
    <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div class="card">
            <img :src="props.data.featured_image" class="card-img-top" :alt="props.data.title">
            <div class="card-body">
                <div class="wrapper-content">
                    <p class="card-text">
                        <div :class="eventTypeClass(props.data.event_type_id)">{{ props.data.event_type }}</div>
                    </p>
                    <h5 class="card-title">{{ props.data.title }}</h5>
                    <p class="card-text"><b>Fecha:</b> {{ departureDate }}</p>
                    <p class="card-text"><b>Lugar:</b> {{ props.data.departure_place_name }}</p>
                    <p class="card-text"><b>Modalidad(es):</b> {{ props.data.event_modes }}</p>
                </div>
                <button class="btn w-100"
                        @click="goToEventInfo">Ver información</button>
                <!--<button class="btn" 
                        @click="setEventDeparturePlace"
                        data-bs-target="#modal-event-departure-place" 
                        data-bs-toggle="modal" 
                        type="button">Ver ubicación</button>-->
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng.js';
import es from './langs/IndexEsp.js';
import { useEventStore } from '../../stores/Event.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default defineComponent({
    emits: ["openEventDeparturePlace"],
    props: {
        data: Object
    },
    setup(props, { emit }) {

        const departureDate = ref(null);
        const messages = {
            en: en,
            es: es
        };
        const router = useRouter();
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();
        const { t } = useI18n({
            messages
        });

        const eventTypeClass = (eventTypeId) => {

            let baseClase = "badge rounded-pill";
            var className = {
                0: baseClase+" text-bg-light",
                1: baseClase+" text-bg-primary",
                2: baseClase+" text-bg-success",
                3: baseClase+" text-bg-warning",
            };

            return (className[eventTypeId]) ? className[eventTypeId] : className[0];

        }

        const dateFormat = () => {

            var format = "";
            var locale = "";

            if(userAccountStore.state.langId === "esp") {
                format = "DD MMMM YYYY hh:mm a";
                locale = "es";
            } else {
                format = "MMMM D, YYYY";
                locale = "en";
            }

            departureDate.value = dayjs(props.data.departure_date).locale(locale).format(format);

        };

        const goToEventInfo = () => {

            localStorage.setItem("eventId", props.data.event_id);
            localStorage.setItem("eventEditionId", props.data.event_edition_id);
            
            eventStore.$patch((store) => {
                store.state.editionId = props.data.event_edition_id;
                store.state.id = props.data.event_id;
            });
            router.push({ name: "event-detail", params: { url : props.data.event_slug } });

        } 

        const setEventDeparturePlace = () => {
            emit("openEventDeparturePlace", props.data.departure_place_url_map);
        };

        onMounted(() => {

            dateFormat();

        });
        
        return {
            departureDate,
            eventTypeClass,
            goToEventInfo,
            props,
            setEventDeparturePlace,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../assets/less/home/EventCard.less"></style>
