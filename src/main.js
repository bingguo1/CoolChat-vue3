import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(far);
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();



const emitter = mitt();
//createApp(App).mount('#app')
const app = createApp(App);

app.config.globalProperties.emitter = emitter;
app.config.globalProperties.$myusername = "";

app.component("font-awesome-icon", FontAwesomeIcon);

// add necessary dependencies...

app.mount("#app");
