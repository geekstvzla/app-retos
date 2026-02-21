<template>
    <div class="row wrapper-personal-data">
        <div class="col">
            <div class="personal-data">
                <h2 class="title">¿Quieres participar?</h2>
                <p>Para participar debes tener lleno con tus datos personales el formulario de <b>Información Personal</b>.</p>
                <p>Si ya posees una cuenta registrada en <b>sumandokilometros.com.ve</b> automaticamente se mostrará tus datos en dicho formulario, de lo contrario debes rellenar el formulario con tu información.</p>
                <p>Es importante que mantengas actualizada tu información personal.</p>
                <div :class="(v$.userId.$errors.length > 0) ? 'field-error' : ''">
                    <button class="btn btn-filled" 
                            @click="openModal"
                            type="button">
                        Ver formulario de información personal
                    </button>
                    <div class="error-msg" v-for="error of v$.userId.$errors" :key="error.$uid">
                        <p>{{ error.$message }}</p>
                    </div>
                </div>
            </div>
        </div>
        <ModalForm />
        <ModalNoSession @showFormPersonalData="showFormPersonalData" />
    </div>
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import { useUserAccountStore } from '../../../../stores/UserAccount.js';
import ModalForm from './ModalForm.vue';
import ModalNoSession from './ModalNoSession.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import * as bootstrap from 'bootstrap';

export default defineComponent({
    components: { 
        ModalForm,
        ModalNoSession
    },
    setup(props) {

        const hasPersonalData = ref(false);
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
        const rules = {
            userId: { required: helpers.withMessage(t('validator.noSession'), () => {
                    return (userAccountStore.state.id !== null);
                }),
                noPersonalData: helpers.withMessage(t('validator.personalDataRequired'), () => {
                    return (userAccountStore.state.name !== null && userAccountStore.state.lastname !== null);
                })
            }
        };
        const v$ = useVuelidate(rules, { userId: userAccountStore.state.id }, { $scope: props.scope });

        const openModal = () => {
           
            if(userAccountStore.state.id === null || parseInt(userAccountStore.state.statusId) === 3) {
               
                modalNoSession.value.show();

            } else {

                modal.value.show();

            }
            
        };

        const showFormPersonalData = () => {

            modal.value.show();

        }

        onMounted(() => {
            
            modal.value = new bootstrap.Modal('#modal-form-personal-data');
            modalNoSession.value = new bootstrap.Modal('#modal-no-session');

        });

        return {
            openModal,
            showFormPersonalData,
            v$
        };

    }
})

</script>

<style lang="less" scoped src="../../../../assets/less/events/event/PersonalData/Index.less"></style>