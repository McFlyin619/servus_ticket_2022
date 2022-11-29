<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container">
			<a class="navbar-brand" href="#"><h3 v-if="companyName === null">ServUs Ticket</h3> <h3 v-else>{{ companyName }}</h3> </a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link class="nav-link active" :to="{ name: 'Home' }">Home</router-link>
					</li>
					<li v-if="loggedInUser !== null" class="nav-item">
						<router-link class="nav-link active" :to="{ name: 'Dashboards' }">Dashboard</router-link>
					</li>
					<li class="nav-item dropdown">
						<a v-if="loggedInUser !== null" class="nav-link dropdown-toggle text-white m-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							<span class="me-2">Manage</span>
						</a>
						<ul class="dropdown-menu bg-dark">
							<li>
								<router-link class="dropdown-item scoped text-white" :to="{ name: 'Data', params: { page: 'customers' } }">Customers</router-link>
							</li>
							<li>
								<router-link class="dropdown-item scoped text-white" :to="{ name: 'Data', params: { page: 'jobsites' } }">Jobsites</router-link>
							</li>
							<li>
								<router-link class="dropdown-item scoped text-white" :to="{ name: 'Data', params: { page: 'services' } }">Services</router-link>
							</li>
						</ul>
					</li>
				</ul>
				<div type="button" class="nav-item text-white me-5" @click="$emit('helpToggle')" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="help-custom-tooltip" data-bs-html="true" data-bs-title="Click to view help/info for this page. <i class='fas fa-info-circle me-1'></i>Tip: Leave this open as you navigate to see info about each page.">Help <i class="fas fa-question fa-xs"></i></div>
				<div class="nav-item dropdown">
					<a class="nav-link dropdown-toggle text-white m-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						<span v-if="loggedInUser !== null" class="me-2">Hello, {{ loggedInUser.attributes.Name }}</span> <span v-else>Menu</span>
					</a>
					<ul class="dropdown-menu dropdown-menu bg-dark">
						<li>
							<a role="button" class="dropdown-item scoped align-self-center text-decoration-none text-white" @click="changeTheme">
								<i v-if="!darkMode" class="fas fa-sun text-white me-2"></i>
								<i v-else class="fas fa-moon text-white me-2"></i>
								<small>{{ darkMode ? 'Go Light' : 'Go Dark' }}</small>
							</a>
						</li>
						<li v-if="loggedInUser === null"><router-link class="dropdown-item scoped text-white" :to="{ name: 'Auth', params: { signUp: 'signUp' } }">Sign Up</router-link></li>
						<li v-if="loggedInUser === null"><router-link class="dropdown-item scoped text-white" :to="{ name: 'Auth', params: { signUp: 'login' } }">Login</router-link></li>
						<li v-if="loggedInUser !== null"><router-link class="dropdown-item scoped text-white" :to="{ name: 'Auth', params: { signUp: 'login' } }">Profile</router-link></li>
						<!-- <li><hr class="dropdown-divider text-white" /></li> -->
						<li v-if="loggedInUser !== null" role="button"><a class="dropdown-item scoped text-white" @click="logout">Logout</a></li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
	emits:['helpToggle'],
	data() {
		return {
			darkMode: false,
			authStore: useAuthStore()
		}
	},
	watch: {
		loggedInUser() {
			this.userDarkMode()
		}
	},
	computed: {
		loggedInUser() {
			return this.authStore.loggedUserInfo
		},
		companyName () {
			return this.authStore.companyName
		}
	},
	methods: {
		userDarkMode() {
			if (this.loggedInUser !== null) {
				this.darkMode = this.loggedInUser.attributes.darkMode
				if (!this.darkMode) document.body.setAttribute('data-theme', 'light')
				if (this.darkMode) document.body.setAttribute('data-theme', 'dark')
			}
		},
		changeTheme() {
			const theme = document.body.getAttribute('data-theme')
			if (theme === 'light') {
				document.body.setAttribute('data-theme', 'dark')
				this.darkMode = true
			} else {
				document.body.setAttribute('data-theme', 'light')
				this.darkMode = false
			}
			this.authStore.setDarkMode(this.darkMode)
		},
		logout () {
			this.authStore.logout()
			setTimeout(() => {
				this.$router.push('/')
			},500)
		}
	}
}
</script>

<style>
.dropdown-item.scoped:hover {
	background-color: var(--main-color);
	color: #fff;
}

.help-custom-tooltip {
	--bs-tooltip-bg: var(--main-color) !important;
}
</style>
