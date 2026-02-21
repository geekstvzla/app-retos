import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserAccountStore = defineStore('userAccount', () => {

    const state = reactive({
        avatar: (localStorage.getItem('userAvatar')) ? localStorage.getItem('userAvatar') : null,
        email: (localStorage.getItem('userEmail')) ? localStorage.getItem('userEmail') : null,
        name: (localStorage.getItem('userFirstName')) ? localStorage.getItem('userFirstName') : null,
        id: (localStorage.getItem('userId')) ? localStorage.getItem('userId') : null,
        langId: 'esp',
        lastname: (localStorage.getItem('userLastName')) ? localStorage.getItem('userLastName') : null,
        logged: (localStorage.getItem('userId')) ? true : false,
        statusId: (localStorage.getItem('userStatusId')) ? localStorage.getItem('userStatusId') : null,
        username: (localStorage.getItem('username')) ? localStorage.getItem('username') : null
    })

    const updateState = (userData = {}) => {
        state.avatar = (userData.avatar) ? userData.avatar : null
        state.id = (userData.id) ? userData.id : null
        state.username = (userData.username) ? userData.username : null
    }

    return { state, updateState }

})
