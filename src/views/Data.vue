<template>
	<div>
		<customer-view v-if="$route.params.page === 'customers'" :isAdmin="isAdmin"></customer-view>
		<location-view v-if="$route.params.page === 'locations'" :isAdmin="isAdmin"></location-view>
		<ticket-view v-if="$route.params.page === 'tickets'" :isAdmin="isAdmin"></ticket-view>
	</div>
</template>

<script>
import CustomerView from '@/components/data/Customers.vue'
import LocationView from '@/components/data/Locations.vue'
import TicketView from '@/components/data/Tickets.vue'
import { useAuthStore } from '@/stores/auth.js'
export default {
	props:['isAdmin'],
	components: {
		CustomerView,
		LocationView,
		TicketView
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
