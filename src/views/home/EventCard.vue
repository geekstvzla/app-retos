<template>
    <div class="col-12 col-sm-2 col-md-4">
        <div class="card">
            <div class="card-header">
                <img :src="userAvatar" class="avatar d-block">
                <span class="username">{{ props.data.username }}</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ props.data.product_price }} / {{ props.data.weighing_unit_abb }}</h5>
                <p class="card-text"><b>Cantidad:</b> {{ props.data.product_amount }}</p>
                <p class="card-text"><b>Distancia:</b> {{ props.data.distance }}</p>
                <button class="btn" @click="trade" type="button">Comerciar</button>
                <button class="btn" @click="location" data-bs-target="#modal-order-location" data-bs-toggle="modal" type="button" >Ver ubicación</button>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng.js';
import es from './langs/IndexEsp.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    emits: ['openLocation'],
    props: {
        data: Object
    },
    setup(props, { emit }) {

        const userAccountStore = useUserAccountStore();
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        const userAvatar = ref('');

        onMounted(() => {
            userAvatar.value = import.meta.env.VITE_API_BASE_URL+"/images/users/default-avatar.webp"
        });

        const location = () => {
            console.log(props.data.latitude)
            console.log(props.data.longitude)
            emit("openLocation");
        }

        const trade = () => {

        }
        
        return {
            location,
            props,
            trade,
            t,
            userAvatar
        };

    }
})

</script>

<style lang="less" scoped src="../../assets/less/home/EventCard.less"></style>
