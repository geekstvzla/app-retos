import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', () => {

    const state = reactive({
        editionId: (localStorage.getItem('eventEditionId')) ? parseInt(localStorage.getItem('eventEditionId')) : null,
        id: (localStorage.getItem('eventId')) ? parseInt(localStorage.getItem('eventId')) : null,
        typeId: (localStorage.getItem('eventEditionTypeId')) ? parseInt(localStorage.getItem('eventEditionTypeId')) : null,
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
