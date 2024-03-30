import { reactive } from 'vue'
import { defineStore } from 'pinia'
import CryptoJS from "crypto-js"
import AES from 'crypto-js/aes'

export const useEncryptionStore = defineStore('encryption', () => {

    const state = reactive({
        iv: import.meta.env.VITE_ENCRYPTION_IV,
        key: import.meta.env.VITE_ENCRYPTION_KEY
    })

    const decrypt = (value) => {
    
        if(state.iv !== null && state.key !== null){

            let iv = CryptoJS.enc.Hex.parse(state.iv)
            let key = CryptoJS.enc.Hex.parse(state.key)

            var decrypted = CryptoJS.AES.decrypt(value, key, {
                mode: CryptoJS.mode.CTR,
                iv,
                padding: CryptoJS.pad.ZeroPadding
            })

            return decrypted.toString(CryptoJS.enc.Utf8)

        }else{

            return {error: "No iv and key encrypt defined"}

        }

    }

    const encrypt = (value) => {

        if(state.iv !== null && state.key !== null) {

            let iv = CryptoJS.enc.Hex.parse(state.iv)
            let key = CryptoJS.enc.Hex.parse(state.key)

            var encrypted = CryptoJS.AES.encrypt(value, key, {
                mode: CryptoJS.mode.CTR,
                iv,
                padding: CryptoJS.pad.ZeroPadding
            });

            return encrypted.toString()

        } else {

            return {error: "No iv and key encrypt defined"}

        }

    }

    return { decrypt, encrypt }

})
