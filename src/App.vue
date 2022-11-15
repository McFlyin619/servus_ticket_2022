<template>
	<div>
		<loading-icon v-if="isLoading"></loading-icon>
		<navbar />
		<router-view />
	</div>
</template>
<script>
import Navbar from './components/layout/Navbar.vue'
import LoadingIcon from './components/ui/LoadingIcon.vue'
import { useAuthStore } from '@/stores/auth.js'

export default {
	components: {
		Navbar,
		LoadingIcon
	},
	data() {
		return {
			authStore: useAuthStore()
		}
	},
	created() {
		this.authStore.tryLogin()
	},
	computed: {
		isLoading() {
			return this.authStore.loadingState
		}
	}
}
</script>