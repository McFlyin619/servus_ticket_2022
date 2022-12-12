<template>
	<div>
		<div class="row row-cols-1 row-cols-md-3 g-4">
			<number-card :title="'Tickets'" :number="ticketCount"></number-card>
			<number-card :title="'Customers'" :number="customerCount"></number-card>
			<number-card :title="'Customers'" :number="customerCount"></number-card>
		</div>
	</div>
</template>

<script>
import { useCustomersStore } from '@/stores/customers.js'
import { useTicketsStore } from '@/stores/tickets.js'
export default {
	data() {
		return {
			customerStore: useCustomersStore(),
			ticketStore: useTicketsStore()
		}
	},
	computed: {
		customerCount() {
			return this.customerStore.allCustomers.length
		},
		ticketCount() {
			return this.ticketStore.allTickets.length
		}
	}
}
</script>