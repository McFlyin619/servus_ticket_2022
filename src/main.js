import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Tooltip } from 'bootstrap'
import { AgChartsVue } from 'ag-charts-vue3';
import VueTour from 'v3-tour'
import NumberCard from '@/components/layout/NumberCard.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

new Tooltip(document.body, {
	selector: "[data-bs-toggle='tooltip']",
	trigger: 'hover'
})

require('v3-tour/dist/vue-tour.css')

var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(VueTour)

app.component('number-card', NumberCard)
app.component('ag-charts-vue', AgChartsVue)

app.mount('#app')