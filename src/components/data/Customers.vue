<template>
	<div>
		<AddNew v-if="showAddNew" :show="showAddNew" :title="'Customer'" @close="showAddNew = false"></AddNew>
		<div class="d-flex justify-content-between">
			<h1 class="txt-main"><i class="far fa-address-book"></i> Customers</h1>
			<div class="btn-group btn-group-sm align-self-center" role="group" aria-label="Small button group">
				<button @click="showAddNew = true" type="button" class="btn but-outline-add"><i class="fas fa-user-plus"></i></button>
				<button disabled type="button" class="btn but-outline-edit"><i class="fas fa-user-edit color-grey1"></i></button>
				<button disabled type="button" class="btn but-outline-delete"><i class="fas fa-trash-alt color-grey1"></i></button>
			</div>
		</div>
		<grid-view :data="gridData" :columnDefs="columnDefs" :sizeColumns="sizeColumns" :darkMode="darkMode" :page="'customer'"></grid-view>
	</div>
</template>

<script>
import GridView from '@/components/ui/GridView.vue'
import { useCustomersStore } from '@/stores/customers.js'
import { useAuthStore } from '@/stores/auth.js'
import AddNew from '../forms/AddNew.vue'

export default {
	components: {
		GridView,
		AddNew
	},
	data() {
		return {
			customersStore: useCustomersStore(),
			authStore: useAuthStore(),
			// gridData: [],
			columnDefs: [{ field: 'firstName' }, { field: 'lastName' }, { field: 'phone' }, { field: 'company' }, { field: 'address' }, { field: 'notes' }],
			sizeColumns: false,
			showAddNew: false
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
		}
	},
	methods: {
		resize() {
			setTimeout(() => {
				this.sizeColumns = true
			}, 20)
		}
	}
}
</script>
