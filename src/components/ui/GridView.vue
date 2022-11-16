<template>
	<div class="d-flex justify-content-center mt-5">
		<ag-grid-vue
			style="width: 90%; height: 65vh;"
			:class="{'ag-theme-alpine' : !darkMode, 'ag-theme-alpine-dark': darkMode }"
			:rowData="data"
			:columnDefs="columnDefs"
			:defaultColDef="defaultColDef"
			:animateRows="true"
			@grid-ready="onGridReady"
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
	props: ['data', 'columnDefs', 'sizeColumns', 'darkMode'],
	components: {
		AgGridVue
	},
	data () {
		return {
			authStore: useAuthStore(),
			gridApi: null,
			columnApi: null,
			defaultColDef: {
				resizable: true
			}
		}
	},
	watch: {
		sizeColumns(val) {
			if(val) {
				this.sizeColumnsNow()
			}
		}
	},
	computed: {
		// darkMode() {
		// 	return this.authStore.darkModeState
		// }
	},
	methods: {
		onGridReady (params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
		},
		sizeColumnsNow () {
			setTimeout(() => {
				this.gridApi.sizeColumnsToFit()
			}, 50)
		},
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
</style>