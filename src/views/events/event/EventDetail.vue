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
                <TechnicalSheetData @eventInfo="setEventInfo" v-if="eventStore.state.id"/>
                <modalities v-if="eventStore.state.id" />
                <AdditionalAccessories v-if="eventInfo.hasAdditionalAccessories && eventStore.state.id"/>
                <PersonalData v-if="userAccountStore.state.id" />
                <Paymethods v-if="eventStore.state.id" />
            </div>
            <div class="col-auto">
                <img :alt="eventInfo.title" class="featured-image img-fluid" :src="eventInfo.featuredImage">
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive } from 'vue';
import { ajax } from '../../../utils/AjaxRequest';
import { useI18n } from 'vue-i18n';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import { useRoute } from 'vue-router';
import AdditionalAccessories from './AdditionalAccessories.vue';
import Modalities from './Modalities.vue';
import Paymethods from './Paymethods.vue';
import PersonalData from './PersonalData.vue';
import TechnicalSheetData from './TechnicalSheetData.vue';

export default defineComponent({
    components: {
        AdditionalAccessories,
        Modalities,
        Paymethods,
        PersonalData,
        TechnicalSheetData
    },
    setup() {

        //const departureDate = ref(null);
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

        const route = useRoute();

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
            eventInfo,
            eventStore,
            userAccountStore,
            setEventInfo,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/EventDetail.less"></style>