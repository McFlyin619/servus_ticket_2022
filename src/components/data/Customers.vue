<template>
		<grid-view :data="gridData" :columnDefs="columnDefs"></grid-view>
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
			gridData: [],
			columnDefs: [
				{ field: "firstName" },
				{ field: "lastName" },
				{ field: "phone" },
				{ field: "company" },
				{ field: "address" },
				{ field: "notes" },
			]
		}
	},
	watch:{
		companyId () {
			console.log('r')
			this.getCustomers()
		}
	},
	computed: {
		companyId () {
			return this.authStore.getCompanyId
		}
	},
	methods: {
		getCustomers() {
			this.customersStore.getCustomers(this.companyId)
		}
	}
}
</script>
