<template>
    <div class="row wrapper-modalities-sheet">
        <div class="col">
            <div class="modalities-sheet-data">
                <h2 class="title">Accesorios Adicionales</h2>
                <div class="row">
                    <div class="col-12 col-md-6" v-for="(data, index) in accessories">
                        <div class="card mb-4">
                            <div id="carouselExample" class="carousel slide">
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                    <img src="https://i.ytimg.com/vi/lnbvTSs_xCM/hq720.jpg" class="d-block w-100" alt="...">
                                </div>
                                <div class="carousel-item">
                                    <img src="https://i.ytimg.com/vi/lnbvTSs_xCM/hq720.jpg" class="d-block w-100" alt="...">
                                </div>
                                <div class="carousel-item">
                                    <img src="https://i.ytimg.com/vi/lnbvTSs_xCM/hq720.jpg" class="d-block w-100" alt="...">
                                </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ data.item }}</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                <a href="#" class="btn btn-primary">Go somewhere</a>
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
            data,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/Modalities.less"></style>