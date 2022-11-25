<template>
	<div>
		<loading-icon v-if="isLoading"></loading-icon>
		<navbar />
		<router-view class="container mt-3" v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>
<script>
import Navbar from './components/layout/Navbar.vue'
import LoadingIcon from './components/ui/LoadingIcon.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useCustomersStore } from '@/stores/customers.js'
import { useJobsitesStore } from '@/stores/jobsites.js'

export default {
	components: {
		Navbar,
		LoadingIcon
	},
	data() {
		return {
			authStore: useAuthStore(),
			customersStore: useCustomersStore(),
			jobsitesStore: useJobsitesStore()
		}
	},
	created() {
		this.authStore.tryLogin()
		if (this.companyId !== null) this.getData()
	},
	watch: {
		companyId() {
			this.getData()
		}
	},
	computed: {
		isLoading() {
			return this.authStore.loadingState
		},
		companyId() {
			return this.authStore.getCompanyId
		}
	},
	methods: {
		getData() {
			this.customersStore.getCustomers(this.companyId)
			this.jobsitesStore.getJobsites(this.companyId)
		}
	}
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
