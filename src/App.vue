<template>
	<div>
		<loading-icon v-if="isLoading"></loading-icon>
		<navbar @helpToggle="helpToggle" />
		<router-view class="container mt-3" v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
			<transition name="slide">
				<div class="slidein" v-show="showHelp">
					<help-side-bar @takeTour="startTour"></help-side-bar>
				</div>
			</transition>
			<v-tour name="customersTour" :steps="customerSteps"></v-tour>
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
			showHelp: false,
			customerSteps: [
				{
					target: '[data-v-step="0"]', // We're using document.querySelector() under the hood
					header: {
						title: 'Get to know customers!'
					},
					content: `Start by adding customers. These will be who gets the bill, but can also be the location of service. We will find out more about jobsites later.`,
					params: {
						placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					}
				},
				{
					target: '[data-v-step="1"]',
					content: 'Once you have added some customers you can select a customer for more options. This one allows you to just view more info about the customer.',
					params: {
						placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					}
				},
				{
					target: '[data-v-step="2"]',
					content: "Clicking this will open the edit. Make changes quickly and easily to existing customers.",
					params: {
						placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					}
				},
				{
					target: '[data-v-step="3"]',
					content: "Danger Zone! Here is where you can delete a customer. Dont worry, you will get a pop up confirming the deletion.",
					params: {
						placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					}
					// Change pages before showing this step and also do something after this step
					// before: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.$router.push('/'))
					// 	}),
					// after: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.help = false)
					// 	})
				}
			]
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
		},
		startTour(page) {
			this.$tours[page + 'Tour'].start();
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
	z-index: 30;
	top: 69px;
	right: 0;
	height: 93%;
	/* box-shadow: 2px 8px 20px var(--color-grey); */
	transition: all 0.3s ease-in-out;
}

/* before the element is shown, start off the screen to the right */
.slide-enter-active,
.slide-leave-active {
	right: -330px;
}
</style>
