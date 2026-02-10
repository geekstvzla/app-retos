<template>

    <div class="container wrapper-qr-code-form">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <input type="text" class="form-control" v-model.trim="data.enrollNumber" placeholder="Ingrese su número de inscripción">
                <div class="d-grid gap-2">
                    <button class="btn btn-primary search" @click="searchUserData">Consultar</button>
                </div>
                <div class="wrapper-qr-code" ref="wrapperQrcode" v-if="data.qr.code">
                    <h5 class="card-title mb-4">Código QR para el evento</h5>
                    <qrcode-vue :value="data.qr.code" :size="data.qr.size" level="H"  /> 
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary search" @click="downloadQrCode">Descargar</button>
                    </div>
                </div>
            </div>  
        </div>  

    </div>
  
</template>

<script>

import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { useI18n } from 'vue-i18n';
import { ajax } from '../../../utils/AjaxRequest.js';
import en from './langs/ReportPaymentEng.js';
import es from './langs/ReportPaymentEsp.js';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import Alert from '../../../components/Alert.vue';

export default defineComponent({
    components: { 
        Alert,
        QrcodeVue
    },
    props: {},
    setup() {

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        }); 
        
        const value = ref("holaaa");
        const attrs = reactive({
            qr: {
                size: 200,
                value: 'holaaa'
            }
        });
        
        const data = reactive({
            baseUrl: 'https://api.sumandokilometros.com.ve/events/check-point?checkPointId=1&eventEditionId=1&langId=esp&userId=',
            enrollNumber: null,
            qr: {
                code: null,
                size: 200,
                value: 'holaaa'
            }
        });
        const messages = {
            en: en,
            es: es
        };
        const wrapperQrcode = ref(null);
       
        const { t } = useI18n({
            messages
        });  
        
        /*const rules = {
            operationNumber: { 
                onlyTheseCharacters: helpers.withMessage(t('validator.onlyTheseCharacters'), requiredIf((value) => {
                    
                    const regex = /^[a-zA-Z0-9-]+$/;
                    return regex.test(value);

                })),
                required: helpers.withMessage(t('validator.required'), requiredIf(() => {
                    return (eventStore.state.typeId === 1);
                })) 
            },
            paymentDay: { 
                required: helpers.withMessage(t('validator.required'), requiredIf(() => {
                    return (eventStore.state.typeId === 1);
                }))
            },
            voucherFile: { 
                onlyTheseExtensions: helpers.withMessage(t('validator.onlyTheseExtensions'), requiredIf((value) => {
                
                    const isValidImage = /\.(jpg|jpeg|png|pdf)$/i.test(value.name);
                    return isValidImage;

                })),
                required: helpers.withMessage(t('validator.required'), requiredIf(() => {
                    return (eventStore.state.typeId === 1);
                })) 
            }
        };*/
       
        //const v$ = useVuelidate(rules, data, { $scope: props.scope });

        const downloadQrCode = () => {

            let canvasImage = wrapperQrcode.value.getElementsByTagName('canvas')[0].toDataURL('image/png');
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = data.enrollNumber+'.png';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();
            };
            xhr.open('GET', canvasImage);
            xhr.send();

        }

        const searchUserData = () => {

            data.qr.code = null;

            let ajaxData = {
                method: "get",
                params: {
                    eventEditionId: 1,
                    langId: 'esp',
                    enrollNumber: data.enrollNumber
                },
                url: import.meta.env.VITE_API_BASE_URL+"/events/user-enrolled-qr-code"
            };

            ajax(ajaxData)
            .then(function (rs) {
                
                if(rs.status === 200 && rs.data) {
                 
                    data.qr.code = data.baseUrl + rs.data.user_id;
                    console.log(data.qr.code)              
                };

            })
            .catch(error => {

                console.log(error);

            });


        }

        onMounted(() => {



        });

        return {
            alertProps,
            attrs,
            data,
            downloadQrCode,
            searchUserData,
            t/*,
            v$*/,
            wrapperQrcode
        };

    }
});

</script>

<style lang="less" scoped src="../../../assets/less/events/event/QRCode.less"></style>