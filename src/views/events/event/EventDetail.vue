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
                <TechnicalSheetData @eventInfo="setEventInfo" />
                <modalities />
                <AdditionalAccessories />
                <PersonalData />
            </div>
            <div class="col-auto">
                <img :alt="eventInfo.title" class="featured-image img-fluid" :src="eventInfo.featuredImage">
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import AdditionalAccessories from './AdditionalAccessories.vue';
import Modalities from './Modalities.vue';
import PersonalData from './PersonalData.vue';
import TechnicalSheetData from './TechnicalSheetData.vue';

export default defineComponent({
    components: {
        AdditionalAccessories,
        Modalities,
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
            title: ""
        });

        const setEventInfo = (data) => {
            console.log(data)
            eventInfo.banner = data.banner;
            eventInfo.featuredImage = data.featuredImage;
            eventInfo.title = data.title;

        };
        
        return {
            eventInfo,
            setEventInfo,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/EventDetail.less"></style>