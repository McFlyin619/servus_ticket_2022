<template>
	<div>
		<loading-icon v-if="isLoading"></loading-icon>
		<navbar @helpToggle="helpToggle"/>
		<router-view class="container mt-3" v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
			<transition name="slide">
				<div class="slidein" v-show="showHelp">
					<help-side-bar></help-side-bar>
				</div>
			</transition>
		</router-view>
	</div>
</template>
<script>
import Navbar from './components/layout/Navbar.vue'
import LoadingIcon from './components/ui/LoadingIcon.vue'
import HelpSideBar from './components/ui/HelpSideBar.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useCustomersStore } from '@/stores/customers.js'
import { useJobsitesStore } from '@/stores/jobsites.js'
import { useServicesStore } from '@/stores/services.js'

export default {
	components: {
		Navbar,
		LoadingIcon,
		HelpSideBar
	},
	data() {
		return {
			authStore: useAuthStore(),
			customersStore: useCustomersStore(),
			jobsitesStore: useJobsitesStore(),
			servicesStore: useServicesStore(),
			showHelp: false
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
			this.servicesStore.getServices(this.companyId)
		},
		helpToggle() {
			this.showHelp = !this.showHelp
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

.slidein {
	width: 300px;
	/* padding: 2em 3em; */
	position: fixed;
	z-index: 100;
	top: 69px;
	right: 0;
	height: 100%;
	box-shadow: 1px 30px 20px var(--color-grey);
	transition: all 0.3s ease-in-out;
}

/* before the element is shown, start off the screen to the right */
.slide-enter-active,
.slide-leave-active {
	right: -330px;
}
</style>
