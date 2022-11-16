import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Data from '../views/Data.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta:
		{
		  public: true
		}
	},
	{
		path: '/auth/:signUp',
		name: 'Auth',
		component: Auth,
		meta:
		{
		  public: true
		}
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

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	const token = authStore.getToken
	if (!to.meta.public) {
		// page requires authentication - if there is none, redirect to /login
		if (token !== null) next()
		else next('/auth/login')
	}
	else {
		// Login is supposedly public - skip navigation if we have a token
		if (token !== null ? to.path !== '/auth/login' : true) next()
	}
})

export default router
