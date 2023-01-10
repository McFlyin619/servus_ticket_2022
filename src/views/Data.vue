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
export default {
	props:['isAdmin'],
	components: {
		CustomerView,
		LocationView,
		TicketView

	}
}
</script>