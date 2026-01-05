<template>
    <div aria-labelledby="modal-no-session-label" 
         aria-hidden="true"
         class="modal fade" 
         data-bs-backdrop="static" 
         data-bs-keyboard="false"
         id="modal-no-session" 
         tabindex="-1" >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" v-if="!showingSignin">
                    <h1 class="modal-title fs-5" id="modal-no-session-label">Tus datos personales</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="!showingSignin">
                    <p><strong class="subtitle">Tu información personal se utilizará para saber a nombre de quien está la inscripción.</strong></p>
                    <p>Debes iniciar sesión en tu cuenta de <b>sumandokilometros.com.ve</b> para poder ver y/o editar tu información personal.</p>
                    <p>Si no tienes una cuenta, puedes crear una de forma gratuita haciendo clic en el botón <strong>Registrar mis datos</strong>.</p>
                </div>
                <div class="modal-body" v-else>
                    <Signin @closeModal="closeModal" :openFrom="'modal'" />
                </div>
                <div class="modal-footer justify-content-center">
                    <button class="btn btn-filled"
                            @click="showSignin(true)"
                            type="button"
                            v-if="!showingSignin">Iniciar Sesión / Registrar mis datos</button>
                    <button class="btn btn-filled"
                            @click="showSignin(false)"
                            type="button"
                            v-else>Atrás</button>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>

import { defineComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useUserAccountStore } from '../../../../stores/UserAccount.js';
import Signin from '../../../signin/Index.vue';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    components: {
        Signin
    },
    setup() {

        const attrs = reactive({
            save: {
                disabled: false,
                html: "Guardar",
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> Guardando</span>'
            }
        });
        
        const data = reactive({
        });
        const messages = {
            en: en,
            es: es
        };
        const modal = ref();
        const route = useRoute();
        const router = useRouter();
        const { t } = useI18n({
            messages
        });  
        const showingSignin = ref(false);
        const userAccountStore = useUserAccountStore();

        function closeModal() {
            
            const modalElement = document.getElementById('modal-no-session');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            showSignin(false);

        };

        function showSignin(value) {

            showingSignin.value = value;

        };

        return {
            closeModal,
            showSignin,
            showingSignin,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../../assets/less/events/event/PersonalData/ModalNoSession.less"></style>