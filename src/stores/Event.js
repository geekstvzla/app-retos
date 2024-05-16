import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', () => {
    const state = reactive({
        id: localStorage.getItem('eventId') ? localStorage.getItem('eventId') : null,
        title: localStorage.getItem('eventTitle') ? localStorage.getItem('eventTitle') : null
    })

    return { state }
})
