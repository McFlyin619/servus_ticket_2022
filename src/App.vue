<template>
	<div>
		<loading-icon v-if="isLoading"></loading-icon>
		<navbar @helpToggle="helpToggle" />
		<modal-layout :show="autoLogout" @close="confirmLogout">
			<template v-slot:default>
				<h1>You have been logged out!</h1>
			</template>
			<template v-slot:footer>
				<div class="d-flex justify-content-center">
					<button
						class="btn but-outline-modal-save"
						@click="confirmLogout"
					>
						Ok
					</button>
				</div>
			</template>
		</modal-layout>
		<div>
			<router-view
				class="container mt-3"
				v-slot="{ Component }"
				:isAdmin="isAdmin"
			>
				<div>
					<transition name="fade" mode="out-in">
						<component :is="Component" />
					</transition>
					<!-- <transition name="slide">
							<div class="slidein" v-show="showHelp">
								<help-side-bar @takeTour="startTour"></help-side-bar>
							</div>
						</transition> -->
					<div
						:class="{'text-bg-dark': darkMode}"
						class="offcanvas offcanvas-end"
						data-bs-scroll="true"
						data-bs-backdrop="true"
						tabindex="-1"
						id="offcanvasScrolling"
						aria-labelledby="offcanvasScrollingLabel"
					>
						<div class="offcanvas-header">
							<h5
								class="offcanvas-title"
								id="offcanvasScrollingLabel"
							>
								Help/Info
							</h5>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="offcanvas"
								aria-label="Close"
							></button>
						</div>
						<div class="offcanvas-body">
							<help-side-bar @takeTour="startTour"></help-side-bar>
						</div>
					</div>
					<v-tour
						name="customersTour"
						:steps="customerSteps"
					></v-tour>
					<v-tour
						name="locationsTour"
						:steps="locationSteps"
					></v-tour>
				</div>
				<button v-show="false" ref="helpMenu" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"></button>
			</router-view>
		</div>
	</div>
</template>
<script>
import Navbar from "./components/layout/Navbar.vue";
import LoadingIcon from "./components/ui/LoadingIcon.vue";
import HelpSideBar from "./components/ui/HelpSideBar.vue";
import ModalLayout from "./components/layout/ModalLayout.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useCustomersStore } from "@/stores/customers.js";
import { useLocationsStore } from "@/stores/locations.js";
import { useTicketsStore } from "@/stores/tickets.js";

export default {
	components: {
		Navbar,
		LoadingIcon,
		HelpSideBar,
		ModalLayout,
	},
	data() {
		return {
			authStore: useAuthStore(),
			customersStore: useCustomersStore(),
			locationsStore: useLocationsStore(),
			ticketsStore: useTicketsStore(),
			customerSteps: [
				{
					target: '[data-v-step="0"]', // We're using document.querySelector() under the hood
					header: {
						title: "Get to know Customers!",
					},
					content: `Start by adding customers. These will be who gets the bill, but can also be the location of service. We will find out more about locations later.`,
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
				},
				{
					target: '[data-v-step="1"]',
					content:
						"Once you have added some customers you can select a customer for more options. This one allows you to just view more info about the customer.",
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
				},
				{
					target: '[data-v-step="2"]',
					content:
						"Clicking this will open the edit. Make changes quickly and easily to existing customers.",
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
				},
				{
					target: '[data-v-step="3"]',
					content:
						"Danger Zone! Here is where you can delete a customer. Dont worry, you will get a pop up confirming the deletion.",
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
					// Change pages before showing this step and also do something after this step
					// before: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.$router.push('/'))
					// 	}),
					// after: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.help = false)
					// 	})
				},
			],
			locationSteps: [
				{
					target: '[data-v-step="0"]', // We're using document.querySelector() under the hood
					header: {
						title: "How to - Locations",
					},
					content: `Start by adding a location. This will be the location where the service will be provided. A location can also be the customers location, so no need to add duplicates.`,
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
				},
				{
					target: '[data-v-step="1"]',
					content:
						"Once you have added some locations you can select a location for more options. This one allows you to just view more info about the customer.",
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
				},
				{
					target: '[data-v-step="2"]',
					content:
						"Clicking this will open the edit. Make changes quickly and easily to existing locations.",
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
				},
				{
					target: '[data-v-step="3"]',
					content:
						"Danger Zone! Here is where you can delete a location. Dont worry, you will get a pop up confirming the deletion.",
					params: {
						placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
					},
					// Change pages before showing this step and also do something after this step
					// before: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.$router.push('/'))
					// 	}),
					// after: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.help = false)
					// 	})
				},
			],
		};
	},
	created() {
		this.authStore.tryLogin();
		if (this.companyId !== null) this.getData();
	},
	watch: {
		companyId() {
			this.getData();
		},
	},
	computed: {
		isLoading() {
			return this.authStore.loadingState;
		},
		companyId() {
			return this.authStore.getCompanyId;
		},
		isAdmin() {
			return this.authStore.getAdmin;
		},
		autoLogout() {
			return this.authStore.getAutoLogout;
		},
		darkMode() {
			return this.authStore.darkModeState
		}
	},
	methods: {
		getData() {
			this.customersStore.getCustomers(this.companyId);
			this.locationsStore.getLocations(this.companyId);
			this.ticketsStore.getTickets(this.companyId);
			this.authStore.getUsers(this.companyId);
		},
		helpToggle() {
			this.$refs.helpMenu.click()
		},
		startTour(page) {
			this.$refs.helpMenu.click()
			this.$tours[page + "Tour"].start();
		},
		confirmLogout() {
			this.authStore.logout();
			this.$router.go();
			setTimeout(() => {
				this.authStore.loggedOutFalse();
			}, 500);
		},
	},
};
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
	width: 301px;
	/* padding: 2em 3em; */
	position: fixed;
	z-index: 30;
	top: 72px;
	right: 5px;
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
