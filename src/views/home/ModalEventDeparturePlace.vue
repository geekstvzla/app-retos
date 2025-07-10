<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-event-departure-place" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Lugar de salida</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <iframe class="departure-place-map" loading="lazy" :src="props.urlMap"></iframe>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/IndexEng.js';
import es from './langs/IndexEsp.js';
import { useUserAccountStore } from '../../stores/UserAccount.js';

export default defineComponent({
    props: {
        urlMap: String
    },
    setup(props) {

        const userAccountStore = useUserAccountStore();
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });

        return {
            props,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../assets/less/home/ModalEventDeparturePlace.less"></style>
