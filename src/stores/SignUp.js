import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useSignupStore = defineStore('signup', () => {

    const state = reactive({
        showing: false,
    });

    return { state }

})
