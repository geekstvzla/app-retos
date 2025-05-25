<template>
    <div class="row g-2 mb-3">
        <div class="col">
            <div class="alert alert-info" role="alert" v-html="t('map.alertInfo')"></div>
        </div>
    </div>
    <div class="row g-2 mb-3">
        <div class="col input-wrapper">
            <div class="form-floating">
                <input class="form-control"
                        id="address"
                        :placeholder="t('map.address.placeholder')"
                        type="text">
                <label>{{ t('map.address.label') }}</label>
            </div>
            <div id="addressHelpBlock" class="form-text">
                {{ t('map.address.help') }}
            </div>
        </div>
    </div>  
    <div class="row g-2 mb-3">
        <div class="col map-wrapper">
            <div id="map"></div>
        </div>
    </div>
    <div class="row g-2 mb-3 wrapper-map-help-block">
        <div class="col">
            <div class="form-text">
                {{ t('map.address.help2') }}
            </div>
        </div>
    </div>
    <div class="row g-2 mb-3">
        <div :class="(v$.address.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
            <input class="form-control"
                    disabled="disabled"
                    id="address"
                    :placeholder="t('map.address.placeholder2')"
                    type="text"
                    v-model="data.address">
            <div class="error-msg" v-for="error of v$.address.$errors" :key="error.$uid">
                <p>{{ error.$message }}</p>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import en from './locales/BuyEng';
import es from './locales/BuyEsp';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useUserAccountStore } from '../../stores/UserAccount.js';
import { Loader } from "@googlemaps/js-api-loader";

export default defineComponent({
    emits: ['addressSelected'],
    props: {
        latLng: Object
    },
    setup(props, { emit }) {

        onMounted(() => {
            initMap();
        });

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
        })
        const marker = ref();

        const data = reactive({
            address: "",
            addressLatLng: {}
        });
        const rules = {
            address: { required: helpers.withMessage(t('validator.required'), required) }
        };
        const v$ = useVuelidate(rules, data);

        watch(() => [
            props.latLng
        ], (newValue, oldValue) => {

            if(Object.keys(newValue[0]).length === 0) {
                data.address = ""
                data.addressLatLng = {}
            }

        });

        const initMap = () => {

            loader.load().then(async () => {

                var map = null

                const { Map } = await google.maps.importLibrary("maps")
                const latLng = { lat: 10.17714270000001, lng: -68.25922953862305 }
                map = new Map(document.getElementById("map"), {
                    center: latLng,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoom: 13,
                    mapId: "sell-address"
                })

                markerMap(map, latLng);
                searchPlaces(map);

                /*if (navigator.geolocation) {

                    navigator.geolocation.getCurrentPosition((position) => {

                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }

                        map.value.setCenter(pos)
                        console.log("SAPE")
                    }, () => {
                        console.log("NO SAPE")
                        map.value.getCenter(latLng)
                    })

                } else {
                    
                    const pos = {
                        lat: -34.397,
                        lng: 150.644,
                    }
                    map.value.setCenter(pos)

                }*/

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

                emit("addressSelected", data.addressLatLng);

                })
                .catch((e) => {
                    console.log("error en traducir las coordenadas")
                });

            });

        };

        const searchPlaces = async (map) => {

            await google.maps.importLibrary("places")
            const input = document.getElementById("address")
            const options = {
                componentRestrictions: { country: "ve" },
                fields: ["address_components", "geometry", "icon", "name"],
                strictBounds: false
            }
            const autocomplete = new google.maps.places.Autocomplete(input, options)

            autocomplete.addListener("place_changed", () => {

                const place = autocomplete.getPlace()

                if (!place.geometry || !place.geometry.location) {

                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;

                } else {

                    data.addressLatLng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }

                }
                
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport)
                    marker.value.position = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
                } else {
                    // NO PROBADO ESTE ELSE
                    map.setCenter(place.geometry.location)
                    map.setZoom(17)
                    marker.value.position = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
                };

                const addressComponents = place.address_components;
                var addressText = "";

                for (let index = 0; index < addressComponents.length; index++) {

                    const address = addressComponents[index];

                    if(index === 0) {
                        addressText = address.long_name;
                    } else {
                        addressText = addressText+", "+address.long_name;
                    };

                };

                data.address = addressText;
                emit("addressSelected", data.addressLatLng);

            });

        };


        return {
            center,
            data,
            t,
            v$
        };

    }
});

</script>

<style lang="less" src="../../assets/less/orders/Map.less" scoped></style>