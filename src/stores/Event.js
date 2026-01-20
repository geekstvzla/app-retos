import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', () => {

    const state = reactive({
        editionId: (localStorage.getItem('eventEditionId')) ? localStorage.getItem('eventEditionId') : null,
        id: (localStorage.getItem('eventId')) ? localStorage.getItem('eventId') : null,
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
        },
    });

    return { state }

})
