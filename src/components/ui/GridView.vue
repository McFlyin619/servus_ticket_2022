<template>
	<div class="d-flex justify-content-center mt-5">
		<ag-grid-vue
			style="width: 100%; height: 75vh;"
			:class="{'ag-theme-alpine': darkMode === false, 'ag-theme-alpine-dark': darkMode === true }"
			:rowData="data"
			:columnDefs="columnDefs"
			:defaultColDef="defaultColDef"
			:animateRows="true"
			:rowHeight="40"
			:overlayNoRowsTemplate="noRowsTemplate"
			rowSelection="single"
			@grid-ready="onGridReady"
			@firstDataRendered="onFirstDataRendered"
			@selection-changed="onSelectionChanged"
		>
		</ag-grid-vue>
	</div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";  // the AG Grid Vue Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
// import "ag-grid-community/styles/ag-theme-dark.css"; // Optional theme CSS
import { useAuthStore } from '@/stores/auth.js'

export default {
	emits: ['itemSelected'],
	props: ['data', 'columnDefs', 'sizeColumns', 'darkMode', 'page', 'saveColumnOrder'],
	components: {
		AgGridVue
	},
	data () {
		return {
			authStore: useAuthStore(),
			gridApi: null,
			columnApi: null,
			defaultColDef: {
				resizable: true,
				filter: true
			},
			noRowsTemplate: `<h1>No ${this.page} data</h1>`,
			selectedItem: null,
			// userColumnOrder: []
		}
	},
	created() {
		setTimeout(() => {
			if( this.userColumnOrder.length > 0) this.columnApi.applyColumnState({ state: this.userColumnOrder, applyOrder: true })
		}, 100)
	},
	watch: {
		// sizeColumns(val) {
		// 	if(val) {
		// 		this.sizeColumnsNow()
		// 	}
		// },
		saveColumnOrder(val) {
			if (val === true) this.saveUserColumnOrder(), console.log(val)
		},
		data(oldVal, newVal) {
			if(oldVal !== newVal) console.log('refreshGrid'), this.gridApi.redrawRows()
		},
	},
	computed: {
		// darkMode() {
		// 	return this.authStore.darkModeState
		// }
		userColumnOrder() {
			return this.authStore.getColumnOrder
		}
	},
	methods: {
		onGridReady (params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
		},
		onFirstDataRendered () {
			this.gridApi.sizeColumnsToFit()
		},
		onSelectionChanged () {
			this.selectedItem = null
			const selectedRows = this.gridApi.getSelectedRows();
			this.selectedItem = selectedRows[0]
			this.$emit('itemSelected', this.selectedItem)
		},
		saveUserColumnOrder() {
			const columnOrder = this.columnApi.getColumnState();
			this.authStore.setColumnOrder(columnOrder)
		}
	}
}
</script>

<style>
.ag-root-wrapper {
	border-radius: 10px;
	padding: 10px;
}

.ag-header {
	border-radius: 10px 10px 0px 0px;
}

.ag-header-cell-text {
	cursor: pointer !important;
}

.ag-icon-menu {
	color: var(--txt-on-main) !important;
}

.ag-icon-menu:hover {
	color: var(--txt-on-main) !important;
	cursor: pointer;
}
</style>