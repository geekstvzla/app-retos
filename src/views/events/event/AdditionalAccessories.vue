<template>
    <div class="row wrapper-modalities-sheet">
        <div class="col">
            <div class="modalities-sheet-data">
                <h2 class="title">Accesorios Adicionales</h2>
                
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
            alertProps,
            attrs,
            data,
            t
        };

    }
})

</script>

<style lang="less" scoped src="../../../assets/less/events/event/Modalities.less"></style>