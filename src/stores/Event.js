import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', () => {

    const state = reactive({
        editionId:  null,
        id: null,
        typeId: null,
        userEnroll: {
            kitAttrs: [],
            kitId: null,
            kitPrice: null,
            kitTitle: null,
            modalityId: null,
            modalityTitle: null,
            operationNumber: null,
            paymentDay: null,
            paymentMethodId: null,
            voucherFile: null
        }
    });

    return { state }

})
