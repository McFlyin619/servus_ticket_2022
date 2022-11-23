<template>
	<div>
		<AddNew v-if="showAddNew" :show="showAddNew" :title="'Customer'" @close="showAddNew = false" @saveEntry="saveEntry"></AddNew>
		<EditItem v-if="showEdit" :show="showEdit" :title="'Customer'" @close="showEdit = false" @saveEditEntry="saveEditEntry" :data="selectedItem"></EditItem>
		<ViewItem v-if="showView" :show="showView" :title="'Customer'" @close="showView = false" :data="selectedItem"></ViewItem>
		<ConfirmModal v-if="showConfirm" @close="showConfirm = false" :title="'Delete'" :message="'Are you sure you want to delete this customer?'" :page="'customer'" :data="selectedItem" :typeOfConfirm="'delete'" @confirm="deleteItem"></ConfirmModal>
		<div class="d-flex justify-content-between">
			<h1 class="txt-main"><i class="far fa-address-book"></i> Customers</h1>
			<div class="btn-group btn-group-sm align-self-center" role="group" aria-label="Small button group">
				<button @click="showAddNew = true" type="button" class="btn but-outline-add" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-custom-class="add-custom-tooltip" data-bs-title="Add new customer">
					<i class="fas fa-user-plus"></i>
				</button>
				<button :disabled="!isItemSelected" @click="showView = true" type="button" class="btn but-outline-view" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="view-custom-tooltip" data-bs-title="View selected customer">
					<i class="fas fa-user-tag"></i>
				</button>
				<button :disabled="!isItemSelected" @click="showEdit = true" type="button" class="btn but-outline-edit" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="edit-custom-tooltip" data-bs-title="Edit selected customer">
					<i class="fas fa-user-edit"></i>
				</button>
				<button :disabled="!isItemSelected" @click="showConfirm = true" type="button" class="btn but-outline-delete" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="delete-custom-tooltip" data-bs-title="Delete selected customer">
					<i class="fas fa-user-times"></i>
				</button>
			</div>
		</div>
		<div class="d-flex justify-content-between">
			<button @click="saveColumnOrder = true" type="button" class="btn but-outline-add align-self-center" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="add-custom-tooltip" data-bs-title="Save current column order">
				Save Column Order <i class="fas fa-check-double"></i>
			</button>
			<input
				id="searchInput"
				v-model="searchValue"
				class="form-control align-self-center w-25"
				type="search"
				placeholder="Search"
				/>
		</div>
		<grid-view :data="gridData" :columnDefs="columnDefs" :sizeColumns="sizeColumns" :page="'customer'" :searchValue="searchValue" :saveColumnOrder="saveColumnOrder" @itemSelected="itemSelected"></grid-view>
	</div>
</template>

<script>
import GridView from '@/components/ui/GridView.vue'
import { useCustomersStore } from '@/stores/customers.js'
import { useAuthStore } from '@/stores/auth.js'
import AddNew from '../forms/AddNew.vue'
import EditItem from '../forms/EditItem.vue'
import ViewItem from '../forms/ViewItem.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'

export default {
	components: {
		GridView,
		AddNew,
		EditItem,
		ViewItem,
		ConfirmModal
	},
	data() {
		return {
			customersStore: useCustomersStore(),
			authStore: useAuthStore(),
			// gridData: [],
			columnDefs: [{ field: 'firstName' }, { field: 'lastName' }, { field: 'phoneNumber' }, { field: 'company' }, { field: 'address' }, { field: 'address2' }, { field: 'city' }, { field: 'state' },{ field: 'zipCode' },  { field: 'notes' }],
			sizeColumns: false,
			showAddNew: false,
			showEdit: false,
			showView: false,
			showConfirm: false,
			selectedItem: false,
			isItemSelected: false,
			saveColumnOrder: false,
			searchValue: null
		}
	},
	created() {
		this.resize()
	},
	computed: {
		gridData() {
			return this.customersStore.allCustomers
		},
		darkMode() {
			return this.authStore.darkModeState
		},
		companyData() {
			return this.authStore.getCompanyObject
		},
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
				await this.customersStore.saveNewCustomer(newPayload)
				setTimeout(() => (this.showAddNew = false), 500)
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
				setTimeout(() => (this.showEdit = false), 500)
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
		}
	}
}
</script>

<style>
#searchInput {
	background-color: var(--background) !important;
	color: var(--txt-on-back) !important;
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
