<template>
	<main-dashboard></main-dashboard>
</template>

<script>
import MainDashboard from '@/components/dashboards/MainDashboard.vue'
import { useAuthStore } from '@/stores/auth.js'
export default {
	components: {
		MainDashboard
	},
	data() {
		return {
			authStore: useAuthStore(),
		}
	},
	created() {
		this.authStore.tryLogin()
	},
}
</script>