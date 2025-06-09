<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="title">{{ t('title') }}</h1>
            </div>
        </div>
        <div class="row wrapper-events">
            <div class="col" v-if="events.length === 0">
                <Alert :options="alertProps"/>
            </div>
            <EventCard @openEventDeparturePlace="setEventDeparturePlace" :data="event" v-for="(event, index) in events" />
        </div>
    </div>
    <ModalEventDeparturePlace :urlMap="urlMap"/>

</template>
<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng';
import es from './langs/IndexEsp';
import { ajax } from '../../utils/AjaxRequest';
import Alert from '../../components/Alert.vue';
import EventCard from './EventCard.vue';
import ModalEventDeparturePlace from './ModalEventDeparturePlace.vue';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    components: {
        Alert,
        EventCard,
        ModalEventDeparturePlace
    },
    setup() {
       
        onBeforeMount(() => {

            searchEvents();

        });

        onMounted(() => {

            if(events.value.length === 0) {
                
                let alertData = {
                    message: "No eventos disponibles en este momento",
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
        const urlMap = ref("");

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
       
        const events = ref([]);

        const searchEvents = async function() {

            let ajaxData = {
                method: "get",
                params: {langId: userAccountStore.state.langId},
                url: import.meta.env.VITE_API_BASE_URL+"/events/active-events"
            };

            ajax(ajaxData)
            .then(function (response) {

                if(response.status === 200 && response.data.response) {
                    events.value = response.data.response.events;
                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        const setEventDeparturePlace = (url) => {
            urlMap.value = url;
        };

        return {
            alertProps,
            events,
            setEventDeparturePlace,
            t,
            urlMap
        }

    }
});

</script>

<style lang="less" scoped src="../../assets/less/home/Index.less"></style>
