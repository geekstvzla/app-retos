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
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modal-no-session-label">Tus datos personales</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong class="subtitle">Tu información personal se utilizará para saber a nombre de quien está la inscripción.</strong></p>
                <p>Debes iniciar sesión en tu cuenta de <b>sumandokilometros.com.ve</b> para poder ver y/o editar tu información personal.</p>
                <p>Si no tienes una cuenta, puedes crear una de forma gratuita haciendo clic en el botón <strong>Registrar mis datos</strong>.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-filled" data-bs-dismiss="modal">Iniciar Sesión</button>
                <button type="button" 
                        class="btn btn-filled" 
                        @click="save">Registrar mis datos</button>
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
import { useUserAccountStore } from '../../../../stores/UserAccount.js';

export default defineComponent({
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
        const { t } = useI18n({
            messages
        });  
   
        const userAccountStore = useUserAccountStore();

        async function save() {
            
            let isFormCorrect = await v$.value.$validate();

            const indexs = Object.keys(attrs);

            if(isFormCorrect) {

                indexs.forEach((index) => {
                    attrs[index].disabled = true;
                });

                attrs.save.html = attrs.save.loadingHtml;
                
                let ajaxData = {
                    method: "post",
                    params: {
                        userId: userAccountStore.state.id,
                        email: userAccountStore.state.email,
                        firstName: data.firstName,
                        middleName: data.middleName,
                        lastName: data.lastName,
                        secondLastName: data.secondLastName,
                        documentTypeId: data.documentTypeId,
                        document: data.document,
                        birthday: data.birthday,
                        genderId: data.genderId,
                        bloodTypeId: data.bloodTypeId,
                        countryPhoneCode: data.countryPhoneCode,
                        phoneNumber: data.phoneNumber,
                        countryEmergencyPhoneCode: data.countryEmergencyPhoneCode,
                        emergencyPhoneNumber: data.emergencyPhoneNumber,
                        medicalCondition: data.medicalCondition,
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/update-user-data"
                };
                
                ajax(ajaxData)
                .then(function (rs) {

                    indexs.forEach((index) => {
                        attrs[index].disabled = false;
                    });

                    attrs.save.html = "Guardar";
                   
                    if(rs.status === 200) {

                        var message = rs.data.message;
                        var typeMessage = rs.data.status;
                       
                        if(rs.data.statusCode === 4) { // Error con el servidor de correo

                            throw {
                                message: t('alert.error.emailNoConnction'),
                                type: "error"
                            };

                        };

                       
                     
                    } else {

                        throw {
                            message: t('alert.error.general'),
                            type: "error"
                        };

                    };

                })
                .catch(error => {

                   
                    

                });

            };

        };

        return {
            save,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../../assets/less/events/event/PersonalData/ModalNoSession.less"></style>