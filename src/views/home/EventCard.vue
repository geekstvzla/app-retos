<template>
    <div class="col-12 col-sm-2 col-md-4">
        <div class="card">
            <img :src="props.data.featured_image" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">{{ props.data.title }}</h5>
                <p class="card-text"><b>Fecha:</b> {{ departureDate }}</p>
                <p class="card-text"><b>Lugar:</b> {{ props.data.departure_place_name }}</p>
                <router-link :to="{ name: 'event-detail', params: { url : props.data.title } }" class="btn">Ver información</router-link>
                <button class="btn" @click="location" data-bs-target="#modal-order-location" data-bs-toggle="modal" type="button" >Ver ubicación</button>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng.js';
import es from './langs/IndexEsp.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default defineComponent({
    emits: ['openLocation'],
    props: {
        data: Object
    },
    setup(props, { emit }) {

        const departureDate = ref(null);
        const messages = {
            en: en,
            es: es
        };
        const userAccountStore = useUserAccountStore();
        const { t } = useI18n({
            messages
        });

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

        const trade = () => {

        }

        onMounted(() => {
            dateFormat();
        });
        
        return {
            departureDate,
            location,
            props,
            trade,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../assets/less/home/EventCard.less"></style>
