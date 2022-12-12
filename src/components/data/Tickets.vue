<template>
	<div>
		<AddNewTicket v-if="showAddNew" :show="showAddNew" :nextTicketNumber="nextTicketNumber" :customers="customers" :jobsites="jobsites" :technicians="technicians" :title="'Ticket'" @close="showAddNew = false" @saveEntry="saveEntry"></AddNewTicket>
		<EditItem v-if="showEdit" :show="showEdit" :title="'Ticket'" @close="showEdit = false" @saveEditEntry="saveEditEntry" :data="selectedItem"></EditItem>
		<ViewItem v-if="showView" :show="showView" :title="'Ticket'" @close="showView = false" :data="selectedItem"></ViewItem>
		<ConfirmModal v-if="showConfirm" @close="showConfirm = false" :title="'Delete'" :message="'Are you sure you want to delete this ticket?'" :page="'tickets'" :data="selectedItem" :typeOfConfirm="'delete'" @confirm="deleteItem"></ConfirmModal>
		<!-- <ConfirmModal v-if="customerError" @close="clearError" :title="'Error'" :message="customerError" :page="'error'" :typeOfConfirm="'error'"></ConfirmModal> -->
		<div class="d-flex justify-content-between">
			<h1 class="txt-main"><i class="far fa-address-book"></i> Tickets</h1>
			<div class="btn-group btn-group-sm align-self-center" role="group" aria-label="Small button group">
				<button data-v-step="0" @click="showAddNew = true" type="button" class="btn but-outline-add" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-custom-class="add-custom-tooltip" data-bs-title="Add new service ticket">
					<i class="fas fa-user-plus fa-1x"></i>
				</button>
				<button data-v-step="1" :disabled="!isItemSelected" @click="showView = true" type="button" class="btn but-outline-view" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="view-custom-tooltip" data-bs-title="View selected service ticket">
					<i class="fas fa-user-tag"></i>
				</button>
				<button data-v-step="2" :disabled="!isItemSelected" @click="showEdit = true" type="button" class="btn but-outline-edit" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="edit-custom-tooltip" data-bs-title="Edit selected service ticket">
					<i class="fas fa-user-edit"></i>
				</button>
				<button data-v-step="3" :disabled="!isItemSelected" @click="showConfirm = true" type="button" class="btn but-outline-delete" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="delete-custom-tooltip" data-bs-title="Delete selected service ticket">
					<i class="fas fa-user-times"></i>
				</button>
			</div>
		</div>
		<div class="d-flex justify-content-between">
			<button @click="saveColumnOrder.value = true" type="button" class="btn but-outline-add align-self-center" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="add-custom-tooltip" data-bs-title="Save current column order">
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
		<grid-view :data="gridData" :columnDefs="columnDefs" :sizeColumns="sizeColumns" :page="'customer'" :searchValue="searchValue" :saveColumnOrder="saveColumnOrder" @itemSelected="itemSelected"></grid-view>
	</div>
</template>

<script>
import GridView from '@/components/ui/GridView.vue'
import { useTicketsStore } from '@/stores/tickets.js'
import { useAuthStore } from '@/stores/auth.js'
import { useCustomersStore } from '@/stores/customers.js'
import { useJobsitesStore } from '@/stores/jobsites.js'
import AddNewTicket from '../forms/AddNewTicket.vue'
import EditItem from '../forms/EditItem.vue'
import ViewItem from '../forms/ViewItem.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
// import TicketFields from '@/configs/tickets.json'

export default {
	components: {
		GridView,
		AddNewTicket,
		EditItem,
		ViewItem,
		ConfirmModal
	},
	data() {
		return {
			ticketsStore: useTicketsStore(),
			authStore: useAuthStore(),
			customersStore: useCustomersStore(),
			jobsitesStore: useJobsitesStore(),
			// gridData: [],
			// eslint-disable-next-line no-constant-condition
			columnDefs: [{field:'ticketNumber', headerName: 'Ticket #'}, {field:'technician.attributes.Name', headerName: 'Technician'}, {field:'jobsite.attributes.address', headerName: 'Jobsite'}, {field:'billedTo.attributes.company', headerName: 'Customer'}, {field:'issue'}],
			sizeColumns: false,
			showAddNew: false,
			showEdit: false,
			showView: false,
			showConfirm: false,
			selectedItem: false,
			isItemSelected: false,
			saveColumnOrder: {
				value: false,
				id: '0'
			},
			searchValue: null
		}
	},
	created() {
		this.resize()
	},
	computed: {
		gridData() {
			const data = []
			// const items = this.ticketsStore.allTickets
			// for (const i in items) data.push(items[i].attributes)
			// return data
			this.ticketsStore.allTickets.reduce((obj, curr) => {
				if (curr.attributes.isJobsiteCustomer) {
					obj = {
						...curr.attributes,
						jobsite: curr.attributes.customerIsJobsite
					}
				} else {
					obj = {
						...curr.attributes
					}
				}
				data.push(obj)
			}, {})
			return data
		},
		darkMode() {
			return this.authStore.darkModeState
		},
		companyData() {
			return this.authStore.getCompanyObject
		},
		ticketError() {
			return this.ticketsStore.getTicketError
		},
		nextTicketNumber() {
			return this.ticketsStore.getNextTicketNumber
		},
		customers() {
			return this.customersStore.allCustomers
		},
		jobsites() {
			return this.jobsitesStore.allJobsites
		},
		technicians() {
			return this.authStore.getTechnicians
		}
	},
	methods: {
		resize() {
			setTimeout(() => {
				this.sizeColumns = true
			}, 20)
		},
		async saveEntry(payload) {
			const newPayload = {
				...payload,
				belongsTo: this.companyData
			}
			try {
				await this.ticketsStore.saveNewTicket(newPayload)
				setTimeout(() => {
					if (this.ticketError === null) {
						this.showAddNew = false
					}
				}, 500)
			} catch (err) {
				console.log(err.message)
			}
		},
		async saveEditEntry(payload) {
			const newPayload = {
				...payload,
				belongsTo: this.companyData
			}
			try {
				await this.customersStore.editCustomer(newPayload)
				setTimeout(() => {
					if (this.customerError === null) {
						this.showEdit = false
					}
				}, 500)
			} catch (err) {
				console.log(err.message)
			}
		},
		itemSelected(payload) {
			if (payload !== null) this.isItemSelected = true, this.selectedItem = payload
		},
		async editItem() {
			console.log(this.selectedItem)
		},
		async deleteItem() {

			try {
				await this.customersStore.deleteCustomer({id: this.selectedItem.id, belongsTo: this.companyData})
				this.showConfirm = false
			} catch (err) {
				console.log(err.message)
			}
		},
		clearError() {
			this.customersStore.clearError()
		},
	}
}
</script>

<style>
#searchInput {
	background-color: #969FD07b !important;
	color: var(--txt-on-back) !important;
	border-color: var(--color-lt-grey);
	width: 25%;
}

::placeholder {
	color: var(--txt-on-back) !important;
}

@media(max-width: 820px) {
	#searchInput {
		width: 50%
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
