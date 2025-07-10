import { defineStore } from 'pinia';
import { createI18n, useI18n } from 'vue-i18n';
/*import { esp } from './langs/Esp'
import { eng } from './langs/Eng'*/

export const useTranslatorStore = defineStore('translator', () => {

    const translation = (langUrl, lang) => {

        var text = "hi";
    
        return text;

    };

    return { translation };

});