<template>
	<div>
		<div class="row row-cols-1 row-cols-md-3 g-4">
			<number-card :title="'Tickets'" :number="ticketCount"></number-card>
			<number-card :title="'Customers'" :number="customerCount"></number-card>
			<number-card :title="'Locations'" :number="locationCount"></number-card>
		</div>
		<bar-chart v-if="!isLoading" :data="chartData" :title="'Total Service Requests: ' + ticketCount"></bar-chart>
	</div>

</template>

<script>
import { useLocationsStore } from '@/stores/locations.js'
import { useCustomersStore } from '@/stores/customers.js'
import { useTicketsStore } from '@/stores/tickets.js'
import { useAuthStore } from '@/stores/auth.js'
import BarChart from '@/components/charts/BarChart.vue';
export default {
	components: {
		BarChart
	},
	data() {
		return {
			locationStore: useLocationsStore(),
			customerStore: useCustomersStore(),
			ticketStore: useTicketsStore(),
			authStore: useAuthStore(),
		}
	},
	computed: {
		isLoading() {
			return this.authStore.loadingState
		},
		locationCount() {
			return this.locationStore.allLocations.length
		},
		customerCount() {
			return this.customerStore.allCustomers.length
		},
		ticketCount() {
			return this.ticketStore.allTickets.length
		},
		chartData() {
			return this.ticketStore.getTicketChartCount
		}
	},
	methods: {
		
	}
}
</script>