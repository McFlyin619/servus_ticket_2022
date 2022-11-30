import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'
import { Tooltip } from 'bootstrap'
new Tooltip(document.body, {
	selector: "[data-bs-toggle='tooltip']",
	trigger: 'hover'
})

import VueTour from 'v3-tour'
require('v3-tour/dist/vue-tour.css')

import NumberCard from '@/components/layout/NumberCard.vue'

// var Parse = require('parse/node')
// Initialize Parse
// Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
// Parse.serverURL = 'https://parseapi.back4app.com/'
const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(VueTour)
// app.use(Parse)
app.component('number-card', NumberCard)

app.mount('#app')