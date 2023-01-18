<template>
	<div>
		<div class="row row-cols-1 row-cols-md-3 g-4">
			<number-card :title="'Tickets'" :number="ticketCount"></number-card>
			<number-card :title="'Customers'" :number="customerCount"></number-card>
			<number-card :title="'Locations'" :number="locationCount"></number-card>
		</div>
		<div class="row">
			<bar-chart v-if="!ticketLoading" :data="chartData" :title="'Total Service Requests: ' + ticketCount"></bar-chart>
			<span v-else class="loader"></span>
		</div>
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
		},
		ticketLoading() {
			return this.ticketStore.getTicketLoading
		}
	},
	methods: {
		
	}
}
</script>
<style scoped>
.loader {
	width: 48px;
	height: 48px;
	display: inline-block;
	position: absolute;
	transform: rotate(45deg);
	z-index: 100;
	left: 50%;
	top: 50%;
}
.loader::before {
	content: '';
	box-sizing: border-box;
	width: 24px;
	height: 24px;
	position: absolute;
	left: 0;
	top: -24px;
	animation: animloader 4s ease infinite;
}
.loader::after {
	content: '';
	box-sizing: border-box;
	position: absolute;
	left: 0;
	top: 0;
	width: 24px;
	height: 24px;
	background: #fff;
	/* box-shadow: 0 0 10px var(--main-color); */
	animation: animloader2 2s ease infinite;
}

@keyframes animloader {
	0% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px rgba(255, 255, 255, 0);
	}
	12% {
		box-shadow: 0 24px var(--main-color), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px rgba(255, 255, 255, 0);
	}
	25% {
		box-shadow: 0 24px var(--main-color), 24px 24px var(--main-color), 24px 48px rgba(255, 255, 255, 0), 0px 48px rgba(255, 255, 255, 0);
	}
	37% {
		box-shadow: 0 24px var(--main-color), 24px 24px var(--main-color), 24px 48px var(--main-color), 0px 48px rgba(255, 255, 255, 0);
	}
	50% {
		box-shadow: 0 24px var(--main-color), 24px 24px var(--main-color), 24px 48px var(--main-color), 0px 48px var(--main-color);
	}
	62% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px var(--main-color), 24px 48px var(--main-color), 0px 48px var(--main-color);
	}
	75% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px var(--main-color), 0px 48px var(--main-color);
	}
	87% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px var(--main-color);
	}
	100% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px rgba(255, 255, 255, 0);
	}
}

@keyframes animloader2 {
	0% {
		transform: translate(0, 0) rotateX(0) rotateY(0);
	}
	25% {
		transform: translate(100%, 0) rotateX(0) rotateY(180deg);
	}
	50% {
		transform: translate(100%, 100%) rotateX(-180deg) rotateY(180deg);
	}
	75% {
		transform: translate(0, 100%) rotateX(-180deg) rotateY(360deg);
	}
	100% {
		transform: translate(0, 0) rotateX(0) rotateY(360deg);
	}
}
</style>