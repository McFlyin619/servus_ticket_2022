<template>
	<div>
		<loading-icon v-if="isLoading"></loading-icon>
		<navbar class="mb-4" />
		<router-view class="container" />
	</div>
</template>
<script>
import Navbar from './components/layout/Navbar.vue'
import LoadingIcon from './components/ui/LoadingIcon.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useCustomersStore } from '@/stores/customers.js'


export default {
	components: {
		Navbar,
		LoadingIcon
	},
	data() {
		return {
			authStore: useAuthStore(),
			customersStore: useCustomersStore(),
		}
	},
	created() {
		this.authStore.tryLogin()
		if(this.companyId !== null) this.getCustomers()
	},
	watch: {
		companyId() {
			this.getCustomers()
		}
	},
	computed: {
		isLoading() {
			return this.authStore.loadingState
		},
		companyId () {
			return this.authStore.getCompanyId
		},
	},
	methods: {
		getCustomers() {
			this.customersStore.getCustomers(this.companyId)
		}
	}
}
</script>