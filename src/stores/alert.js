import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', () => {

    const state = reactive({
        close: false,
        errorMessage: "",
        message: "",
        question: "",
        show: false,
        successMessage: "",
        timer: false,
        timerSeconds: 0,
        type: ""
    })

    const close = () => {
        state.close = false,
        state.errorMessage =  "",
        state.message = "",
        state.question = "",
        state.show = false,
        state.successMessage = "",
        state.timer = false,
        state.timerSeconds = 0,
        state.type = ""
    }

    const showMessage = (alertData) => {
        state.close = (alertData.close) ? alertData.close : false
        state.message = (alertData.message) ? alertData.message : ""
        state.show = (alertData.show) ? alertData.show : false
        state.timer = (alertData.timer) ? alertData.timer : false
        state.timerSeconds = (alertData.timerSeconds) ? alertData.timerSeconds : 0
        state.type = (alertData.type) ? alertData.type : ""
    }

    return { close, showMessage, state }

})
