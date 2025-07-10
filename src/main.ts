import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n, useI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
/*import { Tooltip } from "bootstrap";

const tooltips = new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']"
});*/

const i18n = createI18n({
    legacy: false,
    locale: 'es'
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
