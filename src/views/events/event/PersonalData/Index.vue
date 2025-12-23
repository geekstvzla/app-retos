<template>
    <div class="row wrapper-personal-data">
        <div class="col">
            <div class="personal-data">
                <h2 class="title">¿Quieres participar?</h2>
                <p>Para participar debes tener lleno con tus datos personales el formulario de <b>Información Personal</b>.</p>
                <p>Si ya posees una cuenta registrada en <b>sumandokilometros.com.ve</b> automaticamente se mostrará tus datos en dicho formulario, de lo contrario debes rellenar el formulario con tu información.</p>
                <p>Es importante que mantengas actualizada tu información personal.</p>
                <button class="btn btn-filled" 
                        @click="openModal"
                        type="button">
                    Ver formulario de información personal
                </button>
            </div>
        </div>
    </div>
    <ModalForm />
    <ModalNoSession />
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import { useUserAccountStore } from '../../../../stores/UserAccount.js';
import ModalForm from './ModalForm.vue';
import ModalNoSession from './ModalNoSession.vue';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    components: { 
        ModalForm,
        ModalNoSession
    },
    setup() {

        const messages = {
            en: en,
            es: es
        };
        const modal = ref();
        const modalNoSession = ref();
        const { t } = useI18n({
            messages
        });  
        const userAccountStore = useUserAccountStore();

        const goToLogin = () => {

            

        };

        const openModal = () => {

            if(userAccountStore.state.id === null) {
               
                modalNoSession.value.show();

            } else {

                modal.value.show();

            }
            
        };

        onMounted(() => {
            
            modal.value = new bootstrap.Modal('#modal-form');
            modalNoSession.value = new bootstrap.Modal('#modal-no-session');

        });

        return {
            openModal
        };

    }
})

</script>

<style lang="less" scoped src="../../../../assets/less/events/event/PersonalData/Index.less"></style>