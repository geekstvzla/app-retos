import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserAccountStore = defineStore('userAccount', () => {

    const state = reactive({
        avatar: (localStorage.getItem('userAvatar')) ? localStorage.getItem('userAvatar') : null,
        email: null,
        id: (localStorage.getItem('userId')) ? localStorage.getItem('userId') : null,
        langId: 1,
        logged: (localStorage.getItem('userId')) ? true : false,
        nickname: (localStorage.getItem('userNickname')) ? localStorage.getItem('userNickname') : null
    })

    const updateState = (userData = {}) => {
        state.avatar = (userData.avatar) ? userData.avatar : null
        state.id = (userData.id) ? userData.id : null
        state.nickname = (userData.nickname) ? userData.nickname : null
    }

    return { state, updateState }

})
