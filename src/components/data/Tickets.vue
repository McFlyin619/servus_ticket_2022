<template>
	<div>
		<AddNewTicket
			v-if="showAddNew"
			:show="showAddNew"
			:nextTicketNumber="nextTicketNumber"
			:customers="customers"
			:locations="locations"
			:technicians="technicians"
			:title="'Ticket'"
			@close="showAddNew = false"
			@saveEntry="saveEntry"
		></AddNewTicket>
		<EditTicket
			v-if="showEdit"
			:show="showEdit"
			:title="'Ticket'"
			:customers="customers"
			:locations="locations"
			:technicians="technicians"
			:data="selectedItem"
			@close="showEdit = false"
			@saveEditEntry="saveEditEntry"
		></EditTicket>
		<ViewTicket
			v-if="showView"
			:show="showView"
			:title="'Ticket'"
			@close="showView = false"
			:data="selectedItem"
		></ViewTicket>
		<ConfirmModal
			v-if="showConfirm"
			@close="showConfirm = false"
			:title="'Delete'"
			:message="'Are you sure you want to delete this ticket?'"
			:page="'tickets'"
			:data="selectedItem"
			:typeOfConfirm="'delete'"
			@confirm="deleteItem"
		></ConfirmModal>
		<!-- <ConfirmModal v-if="customerError" @close="clearError" :title="'Error'" :message="customerError" :page="'error'" :typeOfConfirm="'error'"></ConfirmModal> -->
		<div class="d-flex justify-content-between">
			<h1 class="txt-main">
				<i class="far fa-address-book"></i> Service Requests
			</h1>
			<div
				class="btn-group btn-group-sm align-self-center"
				role="group"
				aria-label="Small button group"
			>
				<button
					data-v-step="0"
					@click="showAddNew = true"
					type="button"
					class="btn but-outline-add"
					data-bs-toggle="tooltip"
					data-bs-placement="left"
					data-bs-custom-class="add-custom-tooltip"
					data-bs-title="Add new service request"
				>
					<i class="fas fa-user-plus fa-1x"></i>
				</button>
				<button
					data-v-step="1"
					:disabled="!isItemSelected"
					@click="showView = true"
					type="button"
					class="btn but-outline-view"
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-custom-class="view-custom-tooltip"
					data-bs-title="View selected service request"
				>
					<i class="fas fa-user-tag"></i>
				</button>
				<button
					v-if="isAdmin"
					data-v-step="2"
					:disabled="!isItemSelected"
					@click="showEdit = true"
					type="button"
					class="btn but-outline-edit"
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-custom-class="edit-custom-tooltip"
					data-bs-title="Edit selected service request"
				>
					<i class="fas fa-user-edit"></i>
				</button>
				<button
					v-if="isAdmin"
					data-v-step="3"
					:disabled="!isItemSelected"
					@click="showConfirm = true"
					type="button"
					class="btn but-outline-delete"
					data-bs-toggle="tooltip"
					data-bs-placement="right"
					data-bs-custom-class="delete-custom-tooltip"
					data-bs-title="Delete selected service request"
				>
					<i class="fas fa-user-times"></i>
				</button>
			</div>
		</div>
		<div class="d-flex justify-content-between">
			<button
				@click="saveColumnOrder.value = true"
				type="button"
				class="btn but-outline-add column align-self-center"
				data-bs-toggle="tooltip"
				data-bs-placement="right"
				data-bs-custom-class="add-custom-tooltip"
				data-bs-title="Save current column order"
			>
				Save Column Order <i class="fas fa-check-double"></i>
			</button>
			<input
				id="searchInput"
				v-model="searchValue"
				class="form-control align-self-center cust-search"
				type="search"
				placeholder="Search"
			/>
		</div>
		<grid-view
			:data="gridData"
			:columnDefs="columnDefs"
			:sizeColumns="sizeColumns"
			:page="'ticket'"
			:searchValue="searchValue"
			:saveColumnOrder="saveColumnOrder"
			@itemSelected="itemSelected"
		></grid-view>
	</div>
</template>

<script>
import GridView from "@/components/ui/GridView.vue";
import { useTicketsStore } from "@/stores/tickets.js";
import { useAuthStore } from "@/stores/auth.js";
import { useCustomersStore } from "@/stores/customers.js";
import { useLocationsStore } from "@/stores/locations.js";
import AddNewTicket from "../forms/AddNewTicket.vue";
import EditTicket from "../forms/EditTicket.vue";
import ViewTicket from "../forms/ViewTicket.vue";
import ConfirmModal from "../ui/ConfirmModal.vue";
// import TicketFields from '@/configs/tickets.json'

export default {
	props: ["isAdmin"],
	components: {
		GridView,
		AddNewTicket,
		EditTicket,
		ViewTicket,
		ConfirmModal,
	},
	data() {
		return {
			ticketsStore: useTicketsStore(),
			authStore: useAuthStore(),
			customersStore: useCustomersStore(),
			locationsStore: useLocationsStore(),
			// gridData: [],
			// eslint-disable-next-line no-constant-condition
			columnDefs: [
				{
					field: "status",
					headerName: "Status",
				},
				{ field: "ticketNumber", headerName: "Ticket #", sort: "desc" },
				{
					field: "technicianName",
					headerName: "Technician",
				},
				{
					field: "combinedLocation",
					headerName: "Location",
				},
				{
					field: "customer.attributes.company",
					headerName: "Customer",
				},
				{ field: "issue" },
			],
			sizeColumns: false,
			showAddNew: false,
			showEdit: false,
			showView: false,
			showConfirm: false,
			selectedItem: null,
			isItemSelected: false,
			saveColumnOrder: {
				value: false,
				id: "0",
			},
			searchValue: null,
		};
	},
	created() {
		this.resize();
	},
	computed: {
		gridData() {
			const data = [];
			this.ticketsStore.getAllTickets.reduce((obj, curr) => {
				obj = {
					id: curr.id,
					combinedLocation:
						curr.attributes.location.attributes.address +
						" " +
						curr.attributes.location.attributes.address2 +
						", " +
						curr.attributes.location.attributes.city +
						", " +
						curr.attributes.location.attributes.state +
						" " +
						curr.attributes.location.attributes.zipCode,
					technicianName: curr.technicianName,
					...curr.attributes,
				};
				// }
				data.push(obj);
			}, {});
			return data;
		},
		darkMode() {
			return this.authStore.darkModeState;
		},
		companyData() {
			return this.authStore.getCompanyObject;
		},
		ticketError() {
			return this.ticketsStore.getTicketError;
		},
		nextTicketNumber() {
			return this.ticketsStore.getNextTicketNumber;
		},
		customers() {
			return this.customersStore.allCustomers;
		},
		locations() {
			return this.locationsStore.allLocations;
		},
		technicians() {
			return this.authStore.getTechnicians;
		},
	},
	methods: {
		resize() {
			setTimeout(() => {
				this.sizeColumns = true;
			}, 20);
		},
		async saveEntry(payload) {
			const newPayload = {
				...payload,
				belongsTo: this.companyData,
			};
			try {
				await this.ticketsStore.saveNewTicket(newPayload);
				setTimeout(() => {
					if (this.ticketError === null) {
						this.showAddNew = false;
					}
				}, 500);
			} catch (err) {
				console.log(err.message);
			}
		},
		async saveEditEntry(payload) {
			const newPayload = {
				...payload,
				belongsTo: this.companyData,
			};
			try {
				console.log(newPayload);
				await this.ticketsStore.editTicket(newPayload);
				setTimeout(() => {
					if (this.ticketError === null) {
						this.showEdit = false;
					}
				}, 500);
			} catch (err) {
				console.log(err.message);
			}
		},
		itemSelected(payload) {
			if (payload !== null)
				(this.isItemSelected = true), (this.selectedItem = payload);
		},
		async editItem() {
			console.log(this.selectedItem);
		},
		async deleteItem() {
			try {
				await this.ticketsStore.deleteTicket({
					id: this.selectedItem.id,
					belongsTo: this.companyData,
				});
				this.showConfirm = false;
			} catch (err) {
				console.log(err.message);
			}
		},
		clearError() {
			this.ticketsStore.clearError();
		},
	},
};
</script>

<style>
#searchInput {
	background-color: #969fd07b !important;
	color: var(--txt-on-back) !important;
	border-color: var(--color-lt-grey);
	width: 25%;
}

::placeholder {
	color: var(--txt-on-back) !important;
}

@media (max-width: 820px) {
	#searchInput {
		width: 50%;
	}
}

button.but-outline-edit:disabled i {
	color: var(--color-grey);
}

button.but-outline-delete:disabled i {
	color: var(--color-grey);
}

button.but-outline-view:disabled i {
	color: var(--color-grey);
}

.add-custom-tooltip {
	--bs-tooltip-bg: var(--main-color) !important;
}

.view-custom-tooltip {
	--bs-tooltip-bg: var(--info-color) !important;
}

.edit-custom-tooltip {
	--bs-tooltip-bg: var(--warning-color) !important;
	--bs-tooltip-color: var(--background) !important;
}

.delete-custom-tooltip {
	--bs-tooltip-bg: var(--error-color) !important;
}
</style>
