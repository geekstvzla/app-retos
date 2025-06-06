<template>
    HOLA
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import 'dayjs/locale/es';

export default defineComponent({
    setup() {

        const departureDate = ref(null);
        const messages = {
            en: en,
            es: es
        };
        const userAccountStore = useUserAccountStore();
        const { t } = useI18n({
            messages
        });
        
        return {
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/EventDetail.less"></style>