import App from './App.vue'
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas)



//Styles
import './main.scss';
import 'leaflet/dist/leaflet.css';

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app')
