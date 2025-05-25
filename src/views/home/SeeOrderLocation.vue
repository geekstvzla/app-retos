<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-order-location" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './locales/Eng';
import es from './locales/Esp';
import { useUserAccountStore } from '../../stores/UserAccount.js';
import { Loader } from "@googlemaps/js-api-loader";

export default defineComponent({
    props: {
        lat: String,
        lng: String
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

        const center = { lat: 40.689247, lng: -74.044502 };
        
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY
        });
        const marker = ref();
        onMounted(() => {
            initMap();
        })

        /*watch(() => [
            props.latLng
        ], (newValue, oldValue) => {

            if(Object.keys(newValue[0]).length === 0) {
                data.address = ""
                data.addressLatLng = {}
            };

        });*/

        const initMap = () => {

            loader.load().then(async () => {

                var map = null;

                const { Map } = await google.maps.importLibrary("maps");
                const latLng = { lat: 10.17714270000001, lng: -68.25922953862305 };
                map = new Map(document.getElementById("map"), {
                    center: latLng,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoom: 13,
                    mapId: "offcanvas-address"
                });

                markerMap(map, latLng);

            });

        };

        const markerMap = async (map, latLng) => {

            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            const geocoder = new google.maps.Geocoder();

            marker.value = new AdvancedMarkerElement({
                gmpDraggable: true,
                position: latLng,
                map: map,
                title: "¡Arrastrame!"
            });

            marker.value.addListener("dragend", () => {
            
                geocoder.geocode({ location: { lat: marker.value.position.lat, lng: marker.value.position.lng } })
                .then((response) => {
                    
                    data.addressLatLng = { lat: marker.value.position.lat, lng: marker.value.position.lng };

                    let region = response.results.reverse();

                    for (let index = 0; index < region.length; index++) {

                        const element = region[index];
                        const formattedAddress = element.formatted_address;

                        if(element.types.includes("locality")) {
                            data.address = formattedAddress;
                            break;
                        } else if(element.types.includes("route")) {
                    
                            if(!formattedAddress.toUpperCase().includes("VÍA SIN NOMBRE")) {
                                data.address = formattedAddress;
                                break;
                            }
                            
                        } else if(element.types.includes("plus_code")) {
                            data.address = formattedAddress;
                            break;
                        } else {
                            data.address = "Se tomará la Latitud y Logitud donde colocaste el marcador";
                        };

                    };

                })
                .catch((e) => {
                    console.log("error en traducir las coordenadas")
                });

            });

        };

        return {
            center,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../assets/less/home/Map.less"></style>
