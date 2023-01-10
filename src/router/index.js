import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Data from '../views/Data.vue'
import Dashboards from '../views/Dashboards.vue'
// import AddNew from '@/components/forms/AddNew.vue'

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
		component: Data,
		// children: [
		// 	{
		// 		name: 'AddNew',
		// 		path: ':title',
		// 		component: AddNew,
		// 	}
		// ]
	},
	{
		path: '/dashboard',
		name: 'Dashboards',
		component: Dashboards,
		meta:
		{
			public: true
		}
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/t')
	if (to.meta.public) {
		if (token !== null ? to.path !== '/auth/login' : true) next()
		// page requires authentication - if there is none, redirect to /login
	}
	else {
		// Login is supposedly public - skip navigation if we have a token
		if (token !== null) next()
		else next('/auth/login')
	}
})

export default router
