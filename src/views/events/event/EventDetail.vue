<template>
    <div class="container-fluid wrapper-event-banner">
        <div class="row">
            <div class="col">
                <img :alt="eventInfo.title" class="event-banner img-fluid" :src="eventInfo.banner">
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="event-title">{{ eventInfo.title }}</h1>
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
            banner: "",
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
   
                    eventInfo.banner = rs.data.response.banner_image;
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