<template>
    <div class="row wrapper-additional-accessories">
        <div class="col">
            <div class="additional-accessories-data">
                <h2 class="title">Accesorios Adicionales</h2>
                <div class="row">
                    <div class="col-12 col-md-6" v-for="(data, index) in accessories">
                        <div class="card mb-4">
                            <div :id="'accessory-'+data.item_id" class="carousel slide">
                                <div class="carousel-inner">
                                    <div :class="index2 === 0 ? 'carousel-item active' : 'carousel-item'" v-for="(multimedia, index2) in data.multimedia">
                                        <img :src="multimedia.url_media" class="d-block w-100">
                                    </div>
                                </div>
                                <button class="carousel-control-prev" type="button" :data-bs-target="'#accessory-'+data.item_id" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" :data-bs-target="'#accessory-'+data.item_id" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ data.item }}</h5>
                                <p class="card-text">{{ formatCurrency(data.price, 'de-DE', data.currency_abb, data.currency_decimals) }}</p>
                                <div class="input-group">
                                    <input class="form-control"
                                           inputmode="numeric"
                                           oninput="this.value = this.value.replace(/\D+/g, '')"
                                           step="1"
                                           type="number">
                                    <span class="input-group-text">{{ data.currency_symbol }}</span>
                                    <span class="input-group-text">0.00</span>
                                    <button class="btn" @click="checkInventory" type="button">Agregar al Carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/PersonalDataEng.js';
import es from './langs/PersonalDataEsp.js';
import useVuelidate from '@vuelidate/core';
import { helpers, numeric, required } from '@vuelidate/validators';
import { useEventStore } from '../../../stores/Event.js';
import { useUserAccountStore } from '../../../stores/UserAccount.js';
import Alert from '../../../components/Alert.vue';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export default defineComponent({
    components: { 
        Alert
    },
    setup() {

        const accessories = ref([]);
        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });
        const attrs = reactive({
            accessories: {
                disabled: true
            }
        });
        
        const data = reactive([]);
        const messages = {
            en: en,
            es: es
        };
        const { t } = useI18n({
            messages
        });  
        
        const eventStore = useEventStore();
        const userAccountStore = useUserAccountStore();

        const checkInventory = () => {

            console.log("checkInventory");

        }

        const getAccessories = () => {
           
            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: eventStore.state.editionId,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/event-additional-accessories"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                    
                    console.log("*********************************")
                    console.log(rs.data)
                    //kitItems.value = [];
                    accessories.value = rs.data;
                    rs.data.forEach(function(element, index) {
                        //kitItems.value.push({"desc":element.item, "class": "text-bg-primary"});
                    });                    

                };

            })
            .catch(error => {

                console.log(error);

            });

        }

        onBeforeMount(() => {

            getAccessories();
            
        });

        return {
            accessories,
            alertProps,
            attrs,
            checkInventory,
            data,
            formatCurrency,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/AdditionalAccessories.less"></style>