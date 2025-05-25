import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', () => {

    const state = reactive({
        description: (localStorage.getItem('eventDesc')) ? localStorage.getItem('eventDesc') : null,
        id: (localStorage.getItem('eventId')) ? localStorage.getItem('eventId') : null,
        roomId: (localStorage.getItem('roomId')) ? localStorage.getItem('roomId') : null
    })

    const updateState = (eventData = {}) => {
        state.description = (eventData.description) ? eventData.description : null
        state.id = (eventData.id) ? eventData.id : null,
        state.roomId = (eventData.roomId) ? eventData.roomId : null
    }

    return { state, updateState }

})
