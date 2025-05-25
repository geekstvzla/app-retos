import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {

    const state = reactive({
        actionButton: {
            show: false,
            text: null
        },
        autohide: false,
        closeButton: {
            show: false,
            text: null
        },
        loading: false,
        message: "",
        placement: "default",
        title: "",
        type: ""
    })

    const close = () => {
        state.actionButton = {
            show: false,
            text: null
        },
        state.autohide = false,
        state.closeButton = {
            show: false,
            text: null
        },
        state.message = "",
        state.placement = "default",
        state.title = "",
        state.type = ""
    }

    const setToastState = (toastData) => {
        state.actionButton.show = (toastData.actionButton !== null && typeof toastData.actionButton !== "undefined" && toastData.actionButton.show) ? toastData.actionButton.show : false
        state.actionButton.text = (toastData.actionButton !== null && typeof toastData.actionButton !== "undefined" && toastData.actionButton.text) ? toastData.actionButton.text : "Ok"
        state.autohide = (toastData.autohide !== null && typeof toastData.autohide !== "undefined") ? toastData.autohide : true
        state.closeButton.show = (toastData.closeButton !== null && typeof toastData.closeButton !== "undefined" && toastData.closeButton.show) ? toastData.closeButton.show : false
        state.closeButton.text = (toastData.closeButton !== null && typeof toastData.closeButton !== "undefined" && toastData.closeButton.text) ? toastData.closeButton.text : "Cerrar"
        state.message = (toastData.message) ? toastData.message : ""
        state.placement = (toastData.placement) ? toastData.placement : "default"
        state.title = (toastData.title) ? toastData.title : ""
        state.type = (toastData.type) ? toastData.type : ""
    }

    const loading = (show) => {
        state.loading = show
    }

    return { close, loading, setToastState, state }

})
