<template>
    <div class="row wrapper-personal-data">
        <div class="col">
            <div class="personal-data">
                <h2 class="title">¿Quieres participar?</h2>
                <button type="button" class="btn btn-filled" data-bs-toggle="modal" data-bs-target="#personalDataModal">
                    Ver tu información personal
                </button>
            </div>
        </div>
    </div>
    <div class="modal fade" id="personalDataModal" tabindex="-1" aria-labelledby="personalDataModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="personalDataModalLabel">Tus datos personales</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong class="subtitle">Tu información personal se utilizará para saber a nombre de quien está la inscripción.</strong></p>
                <form class="row">
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">Primer nombre</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">Segundo nombre</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">Primer apellido</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">Segundo apellido</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-4">
                        <label for="firstName" class="form-label">Número de cédula</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-4">
                        <label for="firstName" class="form-label">Fecha de nacimiento</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-4">
                        <label for="firstName" class="form-label">Tipo de sangre</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">Teléfono móvil</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">Teléfono móvil de emergencia</label>
                        <input class="form-control"
                            :disabled="attrs.firstName.disabled"
                            id="firstName"
                            type="text"
                            v-model="data.firstName">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="firstName" class="form-label">¿Es alérgico a algún medicamento, alimento, mordedura o picada de animales, o insectos?</label>
                        <textarea class="form-control" id="firstName" rows="3"></textarea>
                    </div>
                    <div class="mb-3 col-12">
                        <label for="firstName" class="form-label">¿Tiene alguna condición médica o discapacidad que debamos saber?</label>
                        <textarea class="form-control" id="firstName" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-filled" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-filled">Guardar</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/EventDetailEng.js';
import es from './langs/EventDetailEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default defineComponent({
    setup() {

        const attrs = reactive({
            firstName: {
                disabled: false
            }
        });
        const eventInfo = reactive({
            arrivalPlaceName: "",
            banner: "",
            departureDate: "",
            departurePlaceName: "",
            distances: "",
            enrollmentEndtDate: "",
            featuredImage: "",
            includes: "",
            modes: "",
            title: ""
        });
        const data = reactive({
            firstName: ""
        });
        const departureDate = ref(null);
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });
        const eventStore = useEventStore();
        const rules = {
            firstName: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const userAccountStore = useUserAccountStore();

        const dateFormat = (dateString) => {

            var format = "";
            var locale = "";

            if(userAccountStore.state.langId === "esp") {
                format = "DD MMMM YYYY hh:mm a";
                locale = "es";
            } else {
                format = "MMMM D, YYYY";
                locale = "en";
            }

            return dayjs(dateString).locale(locale).format(format);

        };
        
        const getPersonalData = () => {

            let ajaxData = {
                method: "get",
                params: {
                    userId: userAccountStore.state.id,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/get-persona-data"
            };

            ajax(ajaxData)
            .then(function (rs) {

                console.log(rs.data)
                if(rs.status === 200 && rs.data.response) {
                    
                    eventInfo.arrivalPlaceName = rs.data.response.arrival_place_name;
                    eventInfo.banner = rs.data.response.banner_image;
                    eventInfo.departureDate = dateFormat(rs.data.response.departure_date);
                    eventInfo.departurePlaceName = rs.data.response.departure_place_name;
                    eventInfo.distances = rs.data.response.event_distances;
                    eventInfo.enrollmentEndtDate = dateFormat(rs.data.response.enrollment_end_date);
                    eventInfo.featuredImage = rs.data.response.featured_image;
                    eventInfo.includes = rs.data.response.event_includes;
                    eventInfo.modes = rs.data.response.event_modes;
                    eventInfo.title = rs.data.response.title;

                };

            })
            .catch(error => {

                console.log(error);

            });

        };

        onBeforeMount(() => {
            getPersonalData();
        });

        return {
            attrs,
            data,
            eventInfo,
            rules,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/PersonalData.less"></style>