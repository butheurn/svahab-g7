import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js' // Import Bootstrap JS
// import 'boxicons/css/boxicons.min.css';
import "./assets/tailwind.css";
import './assets/main.css'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'sweetalert2/dist/sweetalert2.min.css'

dayjs.extend(relativeTime);

const app = createApp(App)
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from './plugins/fontawesome';
app.component('font-awesome-icon', FontAwesomeIcon);
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from './plugins/axios'
import 'uno.css'
import { configure } from 'vee-validate'
import './boxicons.css'



configure({
  validateOnInput: true
})

app.use(createPinia())
app.use(router.router)
app.use(ElementPlus)
app.use(router.simpleAcl)

app.config.globalProperties.$axios = axios

app.mount('#app')
