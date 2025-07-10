import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserAccountStore = defineStore('userAccount', () => {

    const state = reactive({
        avatar: (localStorage.getItem('userAvatar')) ? localStorage.getItem('userAvatar') : null,
        email: null,
        id: (localStorage.getItem('userId')) ? localStorage.getItem('userId') : null,
        langId: 'esp',
        logged: (localStorage.getItem('userId')) ? true : false,
        username: (localStorage.getItem('username')) ? localStorage.getItem('username') : null
    })

    const updateState = (userData = {}) => {
        state.avatar = (userData.avatar) ? userData.avatar : null
        state.id = (userData.id) ? userData.id : null
        state.username = (userData.username) ? userData.username : null
    }

    return { state, updateState }

})
