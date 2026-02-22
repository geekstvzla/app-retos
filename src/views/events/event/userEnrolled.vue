<template>
    <div class="container-fluid container-md" id="wrapper-user-enrolled">
        <div class="row">
            <div class="col">
                <h2 class="title">¡Felicidades {{ userEnrolledInfoData.userFullname }} por tu inscripción! 🥳</h2>
                <p>{{ userEnrolledInfoData.userFullname }} te has registrado en el evento <b>{{ userEnrolledInfoData.title }}</b> con el número de inscripción <b>{{ userEnrolledInfoData.enrollNumber }}</b> en la modalidad <b>{{ userEnrolledInfoData.eventModality }}</b>. Este número de inscripción es tu identificación única para el evento, <b>NO LO PIERDAS</b>.</p>
                <p v-if="userEnrolledInfoData.eventTypeId === 1">Elegistes el kit: <b>{{ userEnrolledInfoData.kit }}</b></p>

                <div class="table-responsive" v-if="userEnrolledInfoData.kitItems.length > 0">
                    <table class="table">
                        <thead>
                            <tr>
                                <th v-for="value in userEnrolledInfoData.kitItems" :key="value.attribute">{{ value.attribute }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td v-for="item in userEnrolledInfoData.kitItems" :key="item.attribute_value">{{ item.attribute_value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="userEnrolledInfoData.eventWhatsappGroup !== null">Para mantenerte día a día más informado te invitamos a unirte al grupo de Whatsapp 👇</p>
                <a v-if="userEnrolledInfoData.eventWhatsappGroup !== null" class="btn-whatsapp-group" target="_blank" :href="userEnrolledInfoData.eventWhatsappGroup">Únete a nuestro grupo de Whatsapp</a>

                <p><b>¿Necesitas comunicarte con alguien relacionado al evento?</b>, a continuación te mostramos los datos de contacto</p>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>N° de teléfono</th>
                                <th>N° Whatsapp</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="contact in userEnrolledInfoData.eventContacts" :key="contact.id">
                                <td>{{ contact.full_name }}</td>
                                <td>{{ contact.phone_number }}</td>
                                <td>{{ contact.whatsapp_number }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ajax } from '../../../utils/AjaxRequest';
import { useI18n } from 'vue-i18n';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';

export default defineComponent({
    components: {
        Alert
    },
    setup() {

        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });
        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const userAccountStore = useUserAccountStore();
        const userEnrolledInfoData = reactive({
            eventContacts: [],
            eventTypeId: null,
            eventModality: "",
            eventWhatsappGroup: null,
            enrollNumber: "",
            userFullname: "",
            kit: "",
            kitItems: [],
            title: ""
        });
        const route = useRoute();
        const router = useRouter();

        const getUserEnrolledInfo = () => {

            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: route.params.eventEditionId,
                    langId: userAccountStore.state.langId,
                    userId: userAccountStore.state.id
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/user-enrolled"
            };
            
            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                
                    userEnrolledInfoData.enrollNumber = rs.data.enroll_number;
                    userEnrolledInfoData.userFullname = rs.data.name;
                    userEnrolledInfoData.kit = rs.data.kit;
                    userEnrolledInfoData.kitItems = rs.data.kitItems;
                    userEnrolledInfoData.eventTypeId = rs.data.event_type_id;
                    userEnrolledInfoData.eventContacts = rs.data.contacts;
                    userEnrolledInfoData.title = rs.data.event_title;
                    userEnrolledInfoData.eventModality = rs.data.event_mode;
                    userEnrolledInfoData.eventWhatsappGroup = rs.data.whatsapp_group;

                    console.log(userEnrolledInfoData.kitItems.length)
                   
                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        onBeforeMount(() => {
      
            getUserEnrolledInfo();
            
        });

        return {
            alertProps,
            t,
            userEnrolledInfoData
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/userEnrolled.less"></style>