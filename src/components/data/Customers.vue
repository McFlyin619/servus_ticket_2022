<template>
		<h1 class="txt-main text-center mt-5">Customers</h1>
		<grid-view :data="gridData" :columnDefs="columnDefs" :sizeColumns="sizeColumns" :darkMode="darkMode"></grid-view>
</template>

<script>
import GridView from '@/components/ui/GridView.vue'
import { useCustomersStore } from '@/stores/customers.js'
import { useAuthStore } from '@/stores/auth.js'


export default {
	components: {
		GridView
	},
	data () {
		return {
			customersStore: useCustomersStore(),
			authStore: useAuthStore(),
			// gridData: [],
			columnDefs: [
				{ field: "firstName" },
				{ field: "lastName" },
				{ field: "phone" },
				{ field: "company" },
				{ field: "address" },
				{ field: "notes" },
			],
			sizeColumns: false
		}
	},
	created() {
		this.resize()
	},
	computed: {
		gridData () {
			return this.customersStore.allCustomers
		},
		darkMode() {
			return this.authStore.darkModeState
		}
	},
	methods: {
		resize() {
			setTimeout(() => {
				this.sizeColumns = true
			},20)
		}
	}
}
</script>
