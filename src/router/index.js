import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Data from '../views/Data.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/auth/:signUp',
		name: 'Auth',
		component: Auth
	},
	{
		path: '/data/:page',
		name: 'Data',
		component: Data
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
