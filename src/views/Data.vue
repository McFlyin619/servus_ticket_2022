<template>
	<div>
		<customer-view v-if="$route.params.page === 'customers'"></customer-view>
		<jobsite-view v-if="$route.params.page === 'jobsites'"></jobsite-view>
		<service-view v-if="$route.params.page === 'services'"></service-view>
		<ticket-view v-if="$route.params.page === 'tickets'"></ticket-view>
	</div>
</template>

<script>
import CustomerView from '@/components/data/Customers.vue'
import JobsiteView from '@/components/data/Jobsites.vue'
import ServiceView from '@/components/data/Services.vue'
import TicketView from '@/components/data/Tickets.vue'
export default {
	components: {
		CustomerView,
		JobsiteView,
		ServiceView,
		TicketView

	}
}
</script>